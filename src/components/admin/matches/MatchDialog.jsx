import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, MapPin, Trophy } from 'lucide-react';
import { matchService } from '@/api/services';

const INITIAL_STATE = {
  team1Id: '',
  team2Id: '',
  matchFormat: 'T20',
  totalOvers: 20,
  venue: '',
  city: '',
  matchDate: new Date().toISOString().slice(0, 16),
  series: 'Team Horizon Premier League',
  tossWinnerId: '',
  tossDecision: '',
};

const OVERS_MAP = {
  T10: 10,
  T20: 20,
  ODI: 50,
  Test: 90,
  'The Hundred': 100,
};

const MatchDialog = ({
  open,
  editMode,
  match,
  teams = [],
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- PREFILL (EDIT MODE) ---------------- */
  useEffect(() => {
    if (editMode && match) {
      setForm({
        team1Id: String(match.team1Id || match.team1?.id || ''),
        team2Id: String(match.team2Id || match.team2?.id || ''),
        matchFormat: match.matchFormat || 'T20',
        totalOvers: match.totalOvers || 20,
        venue: match.venue || '',
        city: match.city || '',
        matchDate: new Date(match.matchDate).toISOString().slice(0, 16),
        series: match.series || '',
        tossWinnerId: String(match.tossWinnerId || ''),
        tossDecision: match.tossDecision || '',
      });
    } else {
      setForm(INITIAL_STATE);
    }
  }, [editMode, match]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const payload = {
        team1Id: Number(form.team1Id),
        team2Id: Number(form.team2Id),
        matchFormat: form.matchFormat,
        totalOvers: Number(form.totalOvers),
        venue: form.venue,
        city: form.city,
        series: form.series,
        matchDate: new Date(form.matchDate).toISOString(),
        tossWinnerId: form.tossWinnerId || null,
        tossDecision: form.tossWinnerId ? form.tossDecision : null,
      };

      // Optional: set battingFirstId automatically
      if (payload.tossWinnerId && payload.tossDecision) {
        payload.battingFirstId =
          payload.tossDecision === 'bat'
            ? payload.tossWinnerId
            : payload.tossWinnerId === payload.team1Id
            ? payload.team2Id
            : payload.team1Id;
      }

      if (editMode && match) {
        await matchService.updateMatch(match.id, payload);
      } else {
        await matchService.createMatch(payload);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving match:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className=" max-w-4xl
    max-h-[calc(100vh-8rem)]
    overflow-y-auto
    mt-12">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editMode ? 'Edit Match' : 'Create Match'}
          </DialogTitle>
        </DialogHeader>

        {/* ---------------- FORM ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          {/* Team 1 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Team 1</label>
            <Select
              value={form.team1Id}
              onValueChange={(v) =>
                setForm({ ...form, team1Id: v })
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select Team 1" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Team 2 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Team 2</label>
            <Select
              value={form.team2Id}
              onValueChange={(v) =>
                setForm({ ...form, team2Id: v })
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select Team 2" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((t) => (
                  <SelectItem
                    key={t.id}
                    value={String(t.id)}
                    disabled={String(t.id) === form.team1Id}
                  >
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Match Format */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Match Format
            </label>
            <Select
              value={form.matchFormat}
              onValueChange={(v) =>
                setForm({
                  ...form,
                  matchFormat: v,
                  totalOvers: OVERS_MAP[v] || 20,
                })
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(OVERS_MAP).map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Overs */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Total Overs
            </label>
            <Input
              type="number"
              className="h-11"
              value={form.totalOvers}
              onChange={(e) =>
                setForm({
                  ...form,
                  totalOvers: Number(e.target.value),
                })
              }
            />
          </div>

          {/* Venue */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex gap-2">
              <MapPin className="w-4 h-4" /> Venue
            </label>
            <Input
              className="h-11"
              value={form.venue}
              onChange={(e) =>
                setForm({ ...form, venue: e.target.value })
              }
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">City</label>
            <Input
              className="h-11"
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex gap-2">
              <Calendar className="w-4 h-4" /> Date & Time
            </label>
            <Input
              type="datetime-local"
              className="h-11"
              value={form.matchDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  matchDate: e.target.value,
                })
              }
            />
          </div>

          {/* Series */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex gap-2">
              <Trophy className="w-4 h-4" /> Series
            </label>
            <Input
              className="h-11"
              value={form.series}
              onChange={(e) =>
                setForm({ ...form, series: e.target.value })
              }
            />
          </div>

          {/* Toss Winner */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Toss Winner (Optional)
            </label>
            <Select
              value={form.tossWinnerId || 'none'}
              onValueChange={(v) =>
                setForm({
                  ...form,
                  tossWinnerId: v === 'none' ? '' : v,
                  tossDecision: '',
                })
              }
              disabled={!form.team1Id || !form.team2Id}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select toss winner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {teams
                  .filter(
                    (t) =>
                      String(t.id) === form.team1Id ||
                      String(t.id) === form.team2Id
                  )
                  .map((t) => (
                    <SelectItem
                      key={t.id}
                      value={String(t.id)}
                    >
                      {t.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Toss Decision */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Toss Decision (Optional)
            </label>
            <Select
              value={form.tossDecision || 'none'}
              onValueChange={(v) =>
                setForm({
                  ...form,
                  tossDecision: v === 'none' ? '' : v,
                })
              }
              disabled={!form.tossWinnerId}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select decision" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="bat">Bat</SelectItem>
                <SelectItem value="bowl">Bowl</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ---------------- FOOTER ---------------- */}
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              submitting ||
              !form.team1Id ||
              !form.team2Id ||
              !form.venue ||
              !form.matchDate
            }
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white cursor-pointer"
          >
            {submitting
              ? 'Saving...'
              : editMode
              ? 'Update Match'
              : 'Create Match'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MatchDialog;
