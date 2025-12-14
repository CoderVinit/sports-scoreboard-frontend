import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button as MuiButton,
} from '@mui/material';
import { Plus, Users, Edit } from 'lucide-react';
import { fetchTeams, createTeam } from '../../features/teams/teamSlice';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { API_BASE_URL } from '../../config/api.config';

const AdminTeams = () => {
  const dispatch = useDispatch();
  const { teams } = useSelector((state) => state.teams);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeam, setNewTeam] = useState({
    name: '',
    shortName: '',
    logo: ''
  });

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  const handleCreateTeam = async () => {
    await dispatch(createTeam(newTeam));
    setOpenDialog(false);
    setNewTeam({ name: '', shortName: '', logo: '' });
    dispatch(fetchTeams());
  };

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setNewTeam({
      name: team.name,
      shortName: team.shortName,
      logo: team.logo || ''
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleUpdateTeam = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${selectedTeam.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTeam),
      });

      if (response.ok) {
        dispatch(fetchTeams());
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedTeam(null);
    setNewTeam({ name: '', shortName: '', logo: '' });
  };

  const handleSubmit = () => {
    if (editMode) {
      handleUpdateTeam();
    } else {
      handleCreateTeam();
    }
  };

  return (
    <AdminLayout
      title="Teams"
      subtitle="Add and manage teams used across all matches."
    >
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-none shadow-2xl mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">Manage Teams</h2>
              <p className="text-green-100">
                {teams?.length || 0} {teams?.length === 1 ? 'team' : 'teams'} registered
              </p>
            </div>
            <Button
              onClick={() => setOpenDialog(true)}
              className="bg-white text-green-600 hover:bg-green-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Team
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teams Table */}
      <Card className="bg-white shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-100 border-b border-gray-300 hover:bg-gray-100">
                <TableHead className="h-12 px-6 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Team
                  </div>
                </TableHead>
                <TableHead className="h-12 px-6 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                  Short Name
                </TableHead>
                <TableHead className="h-12 px-6 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                  Players
                </TableHead>
                <TableHead className="h-12 px-6 text-center text-gray-700 font-semibold text-sm uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams && Array.isArray(teams) && teams.length > 0 ? (
                teams.map((team, index) => (
                  <TableRow
                    key={team.id}
                    className={`
                      border-b border-gray-200
                      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      hover:bg-gray-100
                    `}
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-gray-300 bg-white">
                          {team.logo ? <AvatarImage src={team.logo} alt={team.name} /> : null}
                          <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold text-sm">
                            {team.shortName?.charAt(0) || team.name?.charAt(0) || 'T'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{team.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="font-mono text-gray-700 text-sm font-semibold">{team.shortName}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="text-gray-700 text-sm">{team.playerCount || 0}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTeam(team)}
                        className="h-9 w-9 p-0 hover:bg-blue-600 hover:text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-16 bg-white">
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-gray-100 p-4 rounded-full">
                        <Users className="w-16 h-16 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-700 mb-1">No teams available</p>
                        <p className="text-sm text-gray-500">Add your first team to get started!</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Team' : 'Add New Team'}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the official details for this team as they should appear across the scoreboard.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Team Name"
                value={newTeam.name}
                margin="dense"
                size="small"
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Name (3-4 letters)"
                value={newTeam.shortName}
                margin="dense"
                size="small"
                inputProps={{ maxLength: 4 }}
                helperText="Shown on scorecards and tables (e.g. IND, AUS)."
                onChange={(e) => setNewTeam({ ...newTeam, shortName: e.target.value.toUpperCase() })}
              />
            </Grid>
          </Grid>

          <div className="mt-4 space-y-2">
            <label className="text-sm font-semibold text-gray-700">Team Logo</label>
            <Button
              variant="outline"
              className="h-11"
              asChild={false}
            >
              <label className="flex items-center gap-2 cursor-pointer">
                {newTeam.logo ? 'Change Logo' : 'Upload Logo'}
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
                      const res = await fetch(`${API_BASE_URL || 'http://localhost:3000/api'}/upload/image`, {
                        method: 'POST',
                        body: formData,
                      });

                      const data = await res.json();
                      if (data.success && data.url) {
                        setNewTeam({ ...newTeam, logo: data.url });
                      }
                    } catch (err) {
                      console.error('Logo upload failed', err);
                    }
                  }}
                />
              </label>
            </Button>

            {newTeam.logo && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Logo preview:</p>
                <img
                  src={newTeam.logo}
                  alt="Team logo preview"
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                />
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseDialog}>Cancel</MuiButton>
          <MuiButton
            onClick={handleSubmit}
            variant="contained"
            disabled={!newTeam.name.trim() || !newTeam.shortName.trim()}
          >
            {editMode ? 'Update Team' : 'Add Team'}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminTeams;
