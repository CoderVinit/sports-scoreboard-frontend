import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchService, teamService } from '../../api/services';
import { Edit, Clipboard, CheckCircle, Plus, MoreVertical, Calendar, MapPin, Trophy, Users } from 'lucide-react';
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
import { Card, CardContent } from '../../components/ui/card';
import CricketLoader from '../../components/CricketLoader';

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
    matchDate: new Date().toISOString().slice(0, 16),
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
        tossWinnerId: (newMatch.tossWinnerId && newMatch.tossWinnerId !== 'none') ? newMatch.tossWinnerId : null,
        tossDecision: (newMatch.tossDecision && newMatch.tossDecision !== 'none') ? newMatch.tossDecision : null,
      };
      
      if (matchData.tossWinnerId && matchData.tossDecision) {
        matchData.battingFirstId = matchData.tossDecision === 'bat' ? matchData.tossWinnerId : 
                          (matchData.tossWinnerId === newMatch.team1Id ? newMatch.team2Id : newMatch.team1Id);
      }
      
      await matchService.updateMatch(selectedMatch.id, matchData);
      setSnackbar({ open: true, message: 'Match updated successfully!', severity: 'success' });
      handleCloseDialog();
      
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
        tossWinnerId: (newMatch.tossWinnerId && newMatch.tossWinnerId !== 'none') ? newMatch.tossWinnerId : null,
        tossDecision: (newMatch.tossDecision && newMatch.tossDecision !== 'none') ? newMatch.tossDecision : null,
      };
      
      if (matchData.tossWinnerId && matchData.tossDecision) {
        matchData.battingFirstId = matchData.tossDecision === 'bat' ? matchData.tossWinnerId : 
                          (matchData.tossWinnerId === newMatch.team1Id ? newMatch.team2Id : newMatch.team1Id);
      }
      
      await matchService.createMatch(matchData);
      setSnackbar({ open: true, message: 'Match created successfully!', severity: 'success' });
      handleCloseDialog();
      
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

  if (loading) {
    return (
      <AdminLayout title="Matches" subtitle="Create and maintain fixtures for the tournament.">
        <CricketLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Matches"
      subtitle="Create and maintain fixtures for the tournament."
    >
      {snackbar.open && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-2xl backdrop-blur-sm animate-in slide-in-from-top-5 ${
          snackbar.severity === 'success' ? 'bg-green-50 text-green-800 border-2 border-green-200' : 'bg-red-50 text-red-800 border-2 border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {snackbar.severity === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <span className="w-5 h-5">✕</span>
            )}
            {snackbar.message}
          </div>
        </div>
      )}

      {/* Header Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-2xl mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Manage Matches
              </h2>
              <p className="text-blue-100">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'} total
              </p>
            </div>
            <Button 
              onClick={() => setOpenDialog(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Match
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create / Edit Match Dialog */}
      <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editMode ? 'Edit Match' : 'Create New Match'}
            </DialogTitle>
            <DialogDescription className="text-base">
              Configure the basic details, venue, schedule and optional toss for this match.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Team 1</label>
              <Select value={newMatch.team1Id} onValueChange={(value) => setNewMatch({ ...newMatch, team1Id: value })}>
                <SelectTrigger className="h-11">
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
              <label className="text-sm font-semibold text-gray-700">Team 2</label>
              <Select value={newMatch.team2Id} onValueChange={(value) => setNewMatch({ ...newMatch, team2Id: value })}>
                <SelectTrigger className="h-11">
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
              <label className="text-sm font-semibold text-gray-700">Match Format</label>
              <Select value={newMatch.matchFormat} onValueChange={handleMatchFormatChange}>
                <SelectTrigger className="h-11">
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
              <label className="text-sm font-semibold text-gray-700">Total Overs</label>
              <Input
                type="number"
                value={newMatch.totalOvers}
                onChange={(e) => setNewMatch({ ...newMatch, totalOvers: parseInt(e.target.value) })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Venue
              </label>
              <Input
                value={newMatch.venue}
                onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
                placeholder="Enter venue"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">City</label>
              <Input
                value={newMatch.city}
                onChange={(e) => setNewMatch({ ...newMatch, city: e.target.value })}
                placeholder="Enter city"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Match Date & Time
              </label>
              <Input
                type="datetime-local"
                value={newMatch.matchDate}
                onChange={(e) => setNewMatch({ ...newMatch, matchDate: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Series
              </label>
              <Input
                value={newMatch.series}
                onChange={(e) => setNewMatch({ ...newMatch, series: e.target.value })}
                placeholder="Enter series name"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Toss Winner (Optional)</label>
              <Select value={newMatch.tossWinnerId} onValueChange={(value) => setNewMatch({ ...newMatch, tossWinnerId: value })}>
                <SelectTrigger className="h-11">
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
              <label className="text-sm font-semibold text-gray-700">Toss Decision (Optional)</label>
              <Select 
                value={newMatch.tossDecision} 
                onValueChange={(value) => setNewMatch({ ...newMatch, tossDecision: value })}
                disabled={!newMatch.tossWinnerId}
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
          <DialogFooter className="gap-2">
            <Button onClick={handleCloseDialog} variant="outline" className="h-11">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={submitting || !newMatch.team1Id || !newMatch.team2Id || !newMatch.venue || !newMatch.matchDate}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold h-11 px-6 shadow-lg"
            >
              {submitting ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Match' : 'Create Match')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Premium Matches Table */}
      <Card className="bg-white/90 backdrop-blur-md shadow-2xl border-2 border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-0 hover:bg-gradient-to-r hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600">
                <TableHead className="h-14 px-6 text-white font-bold text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">#</span>
                    Match ID
                  </div>
                </TableHead>
                <TableHead className="h-14 px-6 text-white font-bold text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Teams
                  </div>
                </TableHead>
                <TableHead className="h-14 px-6 text-white font-bold text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Venue
                  </div>
                </TableHead>
                <TableHead className="h-14 px-6 text-white font-bold text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </div>
                </TableHead>
                <TableHead className="h-14 px-6 text-white font-bold text-sm uppercase tracking-wider">Status</TableHead>
                <TableHead className="h-14 px-6 text-center text-white font-bold text-sm uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-4 rounded-full">
                        <Trophy className="w-16 h-16 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-700 mb-1">No matches found</p>
                        <p className="text-sm text-gray-500">Create your first match to get started!</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                matches.map((match, index) => (
                  <TableRow 
                    key={match.id} 
                    className={`
                      border-b border-gray-200/50 transition-all duration-200
                      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                      hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md hover:scale-[1.01]
                      group
                    `}
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                          #{match.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-bold text-gray-900 text-base group-hover:text-blue-700 transition-colors">
                          {match.team1?.shortName || match.team1?.name || 'Team 1'} vs {match.team2?.shortName || match.team2?.name || 'Team 2'}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                          <Trophy className="w-3 h-3 text-amber-500" />
                          <span className="font-medium">{match.series || match.tournament || 'Tournament'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700 group-hover:text-gray-900 transition-colors">
                        <div className="bg-blue-100 p-1.5 rounded-lg">
                          <MapPin className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{match.venue}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700 group-hover:text-gray-900 transition-colors">
                        <div className="bg-indigo-100 p-1.5 rounded-lg">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="font-medium">{new Date(match.matchDate).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        variant={match.status === 'live' ? 'destructive' : match.status === 'completed' ? 'secondary' : 'default'}
                        className="font-bold text-xs px-3 py-1 shadow-sm"
                      >
                        {match.status || 'scheduled'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-9 w-9 p-0 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all duration-200"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md shadow-xl border-2 border-gray-200">
                          <DropdownMenuItem 
                            onClick={() => handleEditMatch(match)} 
                            className="cursor-pointer hover:bg-blue-50 transition-colors"
                          >
                            <Edit className="mr-2 h-4 w-4 text-blue-600" />
                            <span className="font-medium">Edit Match</span>
                          </DropdownMenuItem>
                          {match.status === 'live' && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => navigate(`/admin/score-entry/${match.id}`)} 
                                className="cursor-pointer hover:bg-green-50 transition-colors"
                              >
                                <Clipboard className="mr-2 h-4 w-4 text-green-600" />
                                <span className="font-medium">Score Entry</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleMarkCompleted(match)} 
                                className="cursor-pointer hover:bg-amber-50 transition-colors"
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-amber-600" />
                                <span className="font-medium">Mark Completed</span>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminMatchesStatic;
