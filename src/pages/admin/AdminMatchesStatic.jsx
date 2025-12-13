import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchService, teamService } from '../../api/services';
import { Edit, Clipboard, CheckCircle, Plus, MoreVertical } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const AdminMatchesStatic = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newMatch, setNewMatch] = useState({
    team1Id: '',
    team2Id: '',
    matchFormat: 'T20',
    totalOvers: 20,
    venue: '',
    city: '',
    matchDate: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
    series: 'Team Horizon Premier League',
    tossWinnerId: '',
    tossDecision: 'bat',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [matchesData, teamsData] = await Promise.all([
          matchService.getAllMatches(),
          teamService.getAllTeams()
        ]);
        setMatches(matchesData.data || matchesData.matches || []);
        setTeams(teamsData.data || teamsData.teams || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const navigate = useNavigate();

  const handleEditMatch = (match) => {
    setSelectedMatch(match);
    setEditMode(true);
    setNewMatch({
      team1Id: match.team1Id || match.team1?.id || '',
      team2Id: match.team2Id || match.team2?.id || '',
      matchFormat: match.matchFormat || 'T20',
      totalOvers: match.totalOvers || 20,
      venue: match.venue || '',
      city: match.city || '',
      matchDate: new Date(match.matchDate).toISOString().slice(0, 16),
      series: match.series || 'Team Horizon Premier League',
      tossWinnerId: match.tossWinnerId || '',
      tossDecision: match.tossDecision || 'bat',
    });
    setOpenDialog(true);
  };

  const handleUpdateMatch = async () => {
    try {
      setSubmitting(true);
      const matchData = {
        ...newMatch,
        matchDate: new Date(newMatch.matchDate).toISOString(),
        // Convert empty strings and 'none' to null for toss fields
        tossWinnerId: (newMatch.tossWinnerId && newMatch.tossWinnerId !== 'none') ? newMatch.tossWinnerId : null,
        tossDecision: (newMatch.tossDecision && newMatch.tossDecision !== 'none') ? newMatch.tossDecision : null,
      };
      
      // Add batting first ID if both toss winner and decision are selected
      if (matchData.tossWinnerId && matchData.tossDecision) {
        matchData.battingFirstId = matchData.tossDecision === 'bat' ? matchData.tossWinnerId : 
                          (matchData.tossWinnerId === newMatch.team1Id ? newMatch.team2Id : newMatch.team1Id);
      }
      
      await matchService.updateMatch(selectedMatch.id, matchData);
      setSnackbar({ open: true, message: 'Match updated successfully!', severity: 'success' });
      handleCloseDialog();
      
      // Refresh matches
      const response = await matchService.getAllMatches();
      setMatches(response.data || response.matches || []);
    } catch (error) {
      console.error('Error updating match:', error);
      setSnackbar({ open: true, message: 'Failed to update match', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateMatch = async () => {
    try {
      setSubmitting(true);
      const matchData = {
        ...newMatch,
        matchDate: new Date(newMatch.matchDate).toISOString(),
        // Convert empty strings and 'none' to null for toss fields
        tossWinnerId: (newMatch.tossWinnerId && newMatch.tossWinnerId !== 'none') ? newMatch.tossWinnerId : null,
        tossDecision: (newMatch.tossDecision && newMatch.tossDecision !== 'none') ? newMatch.tossDecision : null,
      };
      
      // Add batting first ID if both toss winner and decision are selected
      if (matchData.tossWinnerId && matchData.tossDecision) {
        matchData.battingFirstId = matchData.tossDecision === 'bat' ? matchData.tossWinnerId : 
                          (matchData.tossWinnerId === newMatch.team1Id ? newMatch.team2Id : newMatch.team1Id);
      }
      
      await matchService.createMatch(matchData);
      setSnackbar({ open: true, message: 'Match created successfully!', severity: 'success' });
      handleCloseDialog();
      
      // Refresh matches
      const response = await matchService.getAllMatches();
      setMatches(response.data || response.matches || []);
    } catch (error) {
      console.error('Error creating match:', error);
      setSnackbar({ open: true, message: 'Failed to create match', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedMatch(null);
    setNewMatch({
      team1Id: '',
      team2Id: '',
      matchFormat: 'T20',
      totalOvers: 20,
      venue: '',
      city: '',
      matchDate: new Date().toISOString().slice(0, 16),
      series: 'Team Horizon Premier League',
      tossWinnerId: '',
      tossDecision: 'bat',
    });
  };

  const handleSubmit = () => {
    if (editMode) {
      handleUpdateMatch();
    } else {
      handleCreateMatch();
    }
  };

  const handleMarkCompleted = async (match) => {
    try {
      setSubmitting(true);
      await matchService.updateMatch(match.id, { status: 'completed' });
      setSnackbar({ open: true, message: 'Match marked as completed!', severity: 'success' });

      const response = await matchService.getAllMatches();
      setMatches(response.data || response.matches || []);
    } catch (error) {
      console.error('Error marking match as completed:', error);
      setSnackbar({ open: true, message: 'Failed to mark match as completed', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleMatchFormatChange = (format) => {
    const oversMap = {
      'T20': 20,
      'T10': 10,
      'ODI': 50,
      'Test': 90,
      'The Hundred': 100
    };
    setNewMatch({ ...newMatch, matchFormat: format, totalOvers: oversMap[format] || 20 });
  };

  return (
    <AdminLayout
      title="Matches"
      subtitle="Create and maintain fixtures for the tournament."
    >
      {snackbar.open && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          snackbar.severity === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {snackbar.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Manage Matches
          </h2>
          <Button 
            onClick={() => setOpenDialog(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Match
          </Button>
        </div>
      </div>

      {/* Create / Edit Match Dialog */}
      <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Match' : 'Create New Match'}</DialogTitle>
            <DialogDescription>
              Configure the basic details, venue, schedule and optional toss for this match.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Team 1</label>
              <Select value={newMatch.team1Id} onValueChange={(value) => setNewMatch({ ...newMatch, team1Id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Team 1" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Team 2</label>
              <Select value={newMatch.team2Id} onValueChange={(value) => setNewMatch({ ...newMatch, team2Id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Team 2" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id} disabled={team.id === newMatch.team1Id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Match Format</label>
              <Select value={newMatch.matchFormat} onValueChange={handleMatchFormatChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="T20">T20</SelectItem>
                  <SelectItem value="T10">T10</SelectItem>
                  <SelectItem value="ODI">ODI</SelectItem>
                  <SelectItem value="Test">Test</SelectItem>
                  <SelectItem value="The Hundred">The Hundred</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Overs</label>
              <Input
                type="number"
                value={newMatch.totalOvers}
                onChange={(e) => setNewMatch({ ...newMatch, totalOvers: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Venue</label>
              <Input
                value={newMatch.venue}
                onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
                placeholder="Enter venue"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input
                value={newMatch.city}
                onChange={(e) => setNewMatch({ ...newMatch, city: e.target.value })}
                placeholder="Enter city"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Match Date & Time</label>
              <Input
                type="datetime-local"
                value={newMatch.matchDate}
                onChange={(e) => setNewMatch({ ...newMatch, matchDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Series</label>
              <Input
                value={newMatch.series}
                onChange={(e) => setNewMatch({ ...newMatch, series: e.target.value })}
                placeholder="Enter series name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Toss Winner (Optional)</label>
              <Select value={newMatch.tossWinnerId} onValueChange={(value) => setNewMatch({ ...newMatch, tossWinnerId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select toss winner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Not selected)</SelectItem>
                  {teams.filter(t => t.id === newMatch.team1Id || t.id === newMatch.team2Id).map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Leave blank if toss is not yet decided.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Toss Decision (Optional)</label>
              <Select 
                value={newMatch.tossDecision} 
                onValueChange={(value) => setNewMatch({ ...newMatch, tossDecision: value })}
                disabled={!newMatch.tossWinnerId}
              >
                <SelectTrigger>
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
          <DialogFooter>
            <Button onClick={handleCloseDialog} variant="outline">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={submitting || !newMatch.team1Id || !newMatch.team2Id || !newMatch.venue || !newMatch.matchDate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Match' : 'Create Match')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Match ID</TableHead>
              <TableHead className="font-bold">Teams</TableHead>
              <TableHead className="font-bold">Venue</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-center font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : matches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No matches found
                </TableCell>
              </TableRow>
            ) : (
              matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell className="font-medium">#{match.id}</TableCell>
                <TableCell>
                  <div className="font-semibold">
                    {match.team1?.shortName || match.team1?.name || 'Team 1'} vs {match.team2?.shortName || match.team2?.name || 'Team 2'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {match.series || match.tournament || 'Tournament'}
                  </div>
                </TableCell>
                <TableCell>{match.venue}</TableCell>
                <TableCell>{new Date(match.matchDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={match.status === 'live' ? 'destructive' : match.status === 'completed' ? 'secondary' : 'default'}
                  >
                    {match.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditMatch(match)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {match.status === 'live' && (
                        <>
                          <DropdownMenuItem onClick={() => navigate(`/admin/score-entry/${match.id}`)}>
                            <Clipboard className="mr-2 h-4 w-4" />
                            Score Entry
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMarkCompleted(match)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Completed
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )))
               }
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default AdminMatchesStatic;
