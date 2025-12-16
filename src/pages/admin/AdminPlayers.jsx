import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, User, Users, Filter, CheckCircle } from 'lucide-react';
import { playerService, teamService } from '../../api/services';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
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
import CricketLoader from '../../components/CricketLoader';

const AdminPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    teamId: '',
    jerseyNumber: '',
    role: 'batsman',
    battingStyle: '',
    bowlingStyle: '',
    dateOfBirth: '',
    nationality: '',
    photo: ''
  });

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await playerService.getAllPlayers();
      setPlayers(response.data || response);
    } catch (error) {
      console.error('Error fetching players:', error);
      setSnackbar({ open: true, message: 'Failed to fetch players', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await teamService.getAllTeams();
      setTeams(response.data || response);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleOpenDialog = (player = null) => {
    if (player) {
      setEditMode(true);
      setCurrentPlayer(player);
      setNewPlayer({
        name: player.name || '',
        teamId: player.teamId || '',
        jerseyNumber: player.jerseyNumber || '',
        role: player.role || 'batsman',
        battingStyle: player.battingStyle || '',
        bowlingStyle: player.bowlingStyle || '',
        dateOfBirth: player.dateOfBirth || '',
        nationality: player.nationality || '',
        photo: player.photo || ''
      });
    } else {
      setEditMode(false);
      setCurrentPlayer(null);
      setNewPlayer({
        name: '',
        teamId: '',
        jerseyNumber: '',
        role: 'batsman',
        battingStyle: '',
        bowlingStyle: '',
        dateOfBirth: '',
        nationality: '',
        photo: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentPlayer(null);
  };

  const handleCreatePlayer = async () => {
    try {
      setLoading(true);
      const playerData = {
        ...newPlayer,
        jerseyNumber: newPlayer.jerseyNumber ? parseInt(newPlayer.jerseyNumber) : null,
        teamId: parseInt(newPlayer.teamId)
      };

      if (editMode && currentPlayer) {
        await playerService.updatePlayer(currentPlayer.id, playerData);
        setSnackbar({ open: true, message: 'Player updated successfully!', severity: 'success' });
      } else {
        await playerService.createPlayer(playerData);
        setSnackbar({ open: true, message: 'Player created successfully!', severity: 'success' });
      }

      handleCloseDialog();
      fetchPlayers();
    } catch (error) {
      console.error('Error saving player:', error);
      setSnackbar({ open: true, message: 'Failed to save player', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;

    try {
      await playerService.deletePlayer(playerId);
      setSnackbar({ open: true, message: 'Player deleted successfully!', severity: 'success' });
      fetchPlayers();
    } catch (error) {
      console.error('Error deleting player:', error);
      setSnackbar({ open: true, message: 'Failed to delete player', severity: 'error' });
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'batsman': return 'default';
      case 'bowler': return 'secondary';
      case 'all-rounder': return 'outline';
      case 'wicket-keeper': return 'destructive';
      default: return 'default';
    }
  };

  // Filter players based on selected team
  const filteredPlayers = selectedTeamId && selectedTeamId !== 'all'
    ? players.filter(player => player.teamId === parseInt(selectedTeamId))
    : players;

  if (loading && players.length === 0) {
    return (
      <AdminLayout title="Players" subtitle="Maintain player profiles used in scorecards and statistics.">
        <CricketLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Players"
      subtitle="Maintain player profiles used in scorecards and statistics."
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
      <Card className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-none shadow-2xl mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Manage Players
              </h2>
              <p className="text-amber-100">
                {filteredPlayers.length} of {players.length} {players.length === 1 ? 'player' : 'players'}
              </p>
            </div>
            <Button 
              onClick={() => handleOpenDialog()}
              className="bg-white text-amber-600 hover:bg-amber-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Player
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Card */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
              <Filter className="w-5 h-5 text-gray-400" />
              <Select value={selectedTeamId || 'all'} onValueChange={setSelectedTeamId}>
                <SelectTrigger className="h-11 w-full sm:w-[250px]">
                  <SelectValue placeholder="Filter by Team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Showing {filteredPlayers.length} of {players.length} players
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classic Players Table */}
      <Card className="bg-white shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-100 border-b border-gray-300 hover:bg-gray-100">
                <TableHead className="h-12 px-6 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Player
                  </div>
                </TableHead>
                <TableHead className="h-12 px-6 text-gray-700 font-semibold text-sm uppercase tracking-wider">Team</TableHead>
                <TableHead className="h-12 px-6 text-gray-700 font-semibold text-sm uppercase tracking-wider">Jersey #</TableHead>
                <TableHead className="h-12 px-6 text-gray-700 font-semibold text-sm uppercase tracking-wider">Role</TableHead>
                <TableHead className="h-12 px-6 text-gray-700 font-semibold text-sm uppercase tracking-wider">Batting</TableHead>
                <TableHead className="h-12 px-6 text-gray-700 font-semibold text-sm uppercase tracking-wider">Bowling</TableHead>
                <TableHead className="h-12 px-6 text-gray-700 font-semibold text-sm uppercase tracking-wider">Matches</TableHead>
                <TableHead className="h-12 px-6 text-center text-gray-700 font-semibold text-sm uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers && Array.isArray(filteredPlayers) && filteredPlayers.length > 0 ? (
                filteredPlayers.map((player, index) => (
                  <TableRow 
                    key={player.id} 
                    className={`
                      border-b border-gray-200
                      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      hover:bg-gray-100
                    `}
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-gray-300">
                          {player.photo ? (
                            <AvatarImage src={player.photo} alt={player.name} />
                          ) : null}
                          <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold text-sm">
                            {player.name?.charAt(0) || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {player.name}
                          </div>
                          {player.nationality && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {player.nationality}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="text-gray-700 text-sm">
                        {player.team?.name || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {player.jerseyNumber ? (
                        <span className="font-mono text-gray-700 text-sm">#{player.jerseyNumber}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant={getRoleBadgeVariant(player.role)} className="capitalize text-xs">
                        {player.role?.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="text-gray-700 text-sm">
                        {player.battingStyle?.replace('-', ' ') || '-'}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="text-gray-700 text-sm">
                        {player.bowlingStyle?.replace(/-/g, ' ') || '-'}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="text-gray-700 text-sm font-medium">{player.matchesPlayed || 0}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(player)}
                          className="h-9 w-9 p-0 hover:bg-blue-600 hover:text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePlayer(player.id)}
                          className="h-9 w-9 p-0 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16 bg-white">
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-gray-100 p-4 rounded-full">
                        <User className="w-16 h-16 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-700 mb-1">
                          {loading ? 'Loading players...' : 'No players available'}
                        </p>
                        <p className="text-sm text-gray-500">Add your first player to get started!</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Create/Edit Player Dialog */}
      <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto mt-12">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold">
              {editMode ? 'Edit Player' : 'Add New Player'}
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Capture the player profile exactly as it should appear in match scorecards.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Player Name *</label>
              <Input
                value={newPlayer.name}
                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                placeholder="Enter player name"
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Team *</label>
              <Select value={newPlayer.teamId} onValueChange={(value) => setNewPlayer({ ...newPlayer, teamId: value })}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Jersey Number</label>
              <Input
                type="number"
                value={newPlayer.jerseyNumber}
                onChange={(e) => setNewPlayer({ ...newPlayer, jerseyNumber: e.target.value })}
                placeholder="e.g., 7"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Role *</label>
              <Select value={newPlayer.role} onValueChange={(value) => setNewPlayer({ ...newPlayer, role: value })}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="batsman">Batsman</SelectItem>
                  <SelectItem value="bowler">Bowler</SelectItem>
                  <SelectItem value="all-rounder">All-Rounder</SelectItem>
                  <SelectItem value="wicket-keeper">Wicket-Keeper</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Batting Style</label>
              <Select value={newPlayer.battingStyle || 'none'} onValueChange={(value) => setNewPlayer({ ...newPlayer, battingStyle: value === 'none' ? '' : value })}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select batting style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="right-hand">Right Hand</SelectItem>
                  <SelectItem value="left-hand">Left Hand</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Bowling Style</label>
              <Select value={newPlayer.bowlingStyle || 'none'} onValueChange={(value) => setNewPlayer({ ...newPlayer, bowlingStyle: value === 'none' ? '' : value })}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select bowling style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="right-arm-fast">Right Arm Fast</SelectItem>
                  <SelectItem value="left-arm-fast">Left Arm Fast</SelectItem>
                  <SelectItem value="right-arm-medium">Right Arm Medium</SelectItem>
                  <SelectItem value="left-arm-medium">Left Arm Medium</SelectItem>
                  <SelectItem value="right-arm-off-spin">Right Arm Off Spin</SelectItem>
                  <SelectItem value="right-arm-leg-spin">Right Arm Leg Spin</SelectItem>
                  <SelectItem value="left-arm-orthodox">Left Arm Orthodox</SelectItem>
                  <SelectItem value="left-arm-chinaman">Left Arm Chinaman</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
              <Input
                type="date"
                value={newPlayer.dateOfBirth}
                onChange={(e) => setNewPlayer({ ...newPlayer, dateOfBirth: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Nationality</label>
              <Input
                value={newPlayer.nationality}
                onChange={(e) => setNewPlayer({ ...newPlayer, nationality: e.target.value })}
                placeholder="e.g., Indian"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Player Photo</label>
              <Button
                variant="outline"
                className="h-11 cursor-pointer"
                asChild={false}
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  {newPlayer.photo ? 'Change Photo' : 'Upload Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const formData = new FormData();
                      formData.append('image', file);

                      try {
                        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/upload/image`, {
                          method: 'POST',
                          body: formData
                        });

                        const data = await res.json();
                        if (data.success && data.url) {
                          setNewPlayer({ ...newPlayer, photo: data.url });
                        }
                      } catch (err) {
                        console.error('Photo upload failed', err);
                      }
                    }}
                  />
                </label>
              </Button>

              {newPlayer.photo && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Photo preview:</p>
                  <img
                    src={newPlayer.photo}
                    alt="Player photo preview"
                    className="w-20 h-20 rounded-full object-cover border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={handleCloseDialog}
              className="h-11 px-6 font-semibold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePlayer}
              disabled={loading || !newPlayer.name || !newPlayer.teamId}
              className="h-11 px-8 font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg cursor-pointer"
            >
              {loading ? 'Saving...' : editMode ? 'Update Player' : 'Create Player'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminPlayers;
