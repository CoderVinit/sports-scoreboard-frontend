import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Calendar, MapPin, Trophy, X } from 'lucide-react';
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

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '& fieldset': { borderColor: '#e2e8f0' },
      '&:hover fieldset': { borderColor: '#94a3b8' },
      '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1px' }
    }
  };

  const selectStyle = {
    borderRadius: '10px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6', borderWidth: '1px' }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        p: 0,
        background: 'linear-gradient(135deg, #0c1929 0%, #1e3a5f 100%)',
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: 'rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Trophy size={22} style={{ color: '#60a5fa' }} />
            </Box>
            <Box>
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.25rem' }}>
                {editMode ? 'Edit Match' : 'Create Match'}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                {editMode ? 'Update match details' : 'Schedule a new match'}
              </Typography>
            </Box>
          </Box>
          <Box
            onClick={onClose}
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              bgcolor: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <X size={18} style={{ color: 'white' }} />
          </Box>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
        <Grid container spacing={3} sx={{ mt: 0 }}>
          {/* Team Selection Section */}
          <Grid item xs={12}>
            <Typography sx={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 2
            }}>
              Team Selection
            </Typography>
          </Grid>

          {/* Team 1 */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Team 1 *</InputLabel>
              <Select
                value={form.team1Id}
                onChange={(e) => setForm({ ...form, team1Id: e.target.value })}
                label="Team 1 *"
                sx={selectStyle}
              >
                {teams.map((t) => (
                  <MenuItem key={t.id} value={String(t.id)}>
                    {t.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Team 2 */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Team 2 *</InputLabel>
              <Select
                value={form.team2Id}
                onChange={(e) => setForm({ ...form, team2Id: e.target.value })}
                label="Team 2 *"
                sx={selectStyle}
              >
                {teams.map((t) => (
                  <MenuItem 
                    key={t.id} 
                    value={String(t.id)}
                    disabled={String(t.id) === form.team1Id}
                  >
                    {t.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Match Details Section */}
          <Grid item xs={12}>
            <Typography sx={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 2,
              mt: 1
            }}>
              Match Details
            </Typography>
          </Grid>

          {/* Match Format */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Match Format</InputLabel>
              <Select
                value={form.matchFormat}
                onChange={(e) => setForm({
                  ...form,
                  matchFormat: e.target.value,
                  totalOvers: OVERS_MAP[e.target.value] || 20,
                })}
                label="Match Format"
                sx={selectStyle}
              >
                {Object.keys(OVERS_MAP).map((f) => (
                  <MenuItem key={f} value={f}>{f}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Total Overs */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Total Overs"
              type="number"
              value={form.totalOvers}
              onChange={(e) => setForm({ ...form, totalOvers: Number(e.target.value) })}
              sx={inputStyle}
            />
          </Grid>

          {/* Venue */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Venue *"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              InputProps={{
                startAdornment: <MapPin size={16} style={{ color: '#94a3b8', marginRight: 8 }} />
              }}
              sx={inputStyle}
            />
          </Grid>

          {/* City */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              sx={inputStyle}
            />
          </Grid>

          {/* Date & Time */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Date & Time *"
              type="datetime-local"
              value={form.matchDate}
              onChange={(e) => setForm({ ...form, matchDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <Calendar size={16} style={{ color: '#94a3b8', marginRight: 8 }} />
              }}
              sx={inputStyle}
            />
          </Grid>

          {/* Series */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Series"
              value={form.series}
              onChange={(e) => setForm({ ...form, series: e.target.value })}
              InputProps={{
                startAdornment: <Trophy size={16} style={{ color: '#94a3b8', marginRight: 8 }} />
              }}
              sx={inputStyle}
            />
          </Grid>

          {/* Toss Section */}
          <Grid item xs={12}>
            <Typography sx={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 2,
              mt: 1
            }}>
              Toss Details (Optional)
            </Typography>
          </Grid>

          {/* Toss Winner */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" disabled={!form.team1Id || !form.team2Id}>
              <InputLabel>Toss Winner</InputLabel>
              <Select
                value={form.tossWinnerId || ''}
                onChange={(e) => setForm({
                  ...form,
                  tossWinnerId: e.target.value,
                  tossDecision: '',
                })}
                label="Toss Winner"
                sx={selectStyle}
              >
                <MenuItem value="">None</MenuItem>
                {teams
                  .filter((t) => String(t.id) === form.team1Id || String(t.id) === form.team2Id)
                  .map((t) => (
                    <MenuItem key={t.id} value={String(t.id)}>
                      {t.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Toss Decision */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" disabled={!form.tossWinnerId}>
              <InputLabel>Toss Decision</InputLabel>
              <Select
                value={form.tossDecision || ''}
                onChange={(e) => setForm({ ...form, tossDecision: e.target.value })}
                label="Toss Decision"
                sx={selectStyle}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="bat">Bat</MenuItem>
                <MenuItem value="bowl">Bowl</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ 
        p: 3, 
        borderTop: '1px solid #e2e8f0',
        gap: 1.5
      }}>
        <Button 
          onClick={onClose}
          sx={{
            px: 3,
            py: 1.25,
            borderRadius: '10px',
            fontWeight: 600,
            textTransform: 'none',
            color: '#64748b',
            border: '1px solid #e2e8f0',
            '&:hover': {
              bgcolor: '#f8fafc',
              borderColor: '#cbd5e1'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting || !form.team1Id || !form.team2Id || !form.venue || !form.matchDate}
          sx={{
            px: 3,
            py: 1.25,
            borderRadius: '10px',
            fontWeight: 600,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
            },
            '&.Mui-disabled': {
              background: '#e2e8f0',
              color: '#94a3b8'
            }
          }}
        >
          {submitting ? 'Saving...' : editMode ? 'Update Match' : 'Create Match'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatchDialog;
