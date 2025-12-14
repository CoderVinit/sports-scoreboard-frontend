import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit, Users, Trophy } from 'lucide-react';
import { fetchTeams, createTeam } from '../../features/teams/teamSlice';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
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
import { teamService } from '../../api/services';
import CricketLoader from '../../components/CricketLoader';
import { API_BASE_URL } from '../../config/api.config';

const AdminTeams = () => {
  const dispatch = useDispatch();
  const { teams, loading } = useSelector((state) => state.teams);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [newTeam, setNewTeam] = useState({
    name: '',
    shortName: '',
    logo: ''
  });

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  if (loading && (!teams || teams.length === 0)) {
    return (
      <AdminLayout
        title="Teams"
        subtitle="Add and manage teams used across all matches."
      >
        <CricketLoader />
      </AdminLayout>
    );
  }

  const handleCreateTeam = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newTeam.name);
      formData.append('shortName', newTeam.shortName);

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await fetch(`${API_BASE_URL}/teams`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setOpenDialog(false);
        setNewTeam({ name: '', shortName: '', logo: '' });
        setLogoFile(null);
        dispatch(fetchTeams());
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setNewTeam({
      name: team.name,
      shortName: team.shortName,
      logo: team.logo || ''
    });
    setLogoFile(null);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleUpdateTeam = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newTeam.name);
      formData.append('shortName', newTeam.shortName);

      if (selectedTeam && selectedTeam.logo) {
        formData.append('existingLogo', selectedTeam.logo);
      }

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await fetch(`${API_BASE_URL}/teams/${selectedTeam.id}`, {
        method: 'PUT',
        body: formData,
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
    setLogoFile(null);
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
              <h2 className="text-3xl font-bold mb-2">
                Manage Teams
              </h2>
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

      {/* Classic Teams Table */}
      <Card className="bg-white shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-100 border-b border-gray-300 hover:bg-gray-100">
                <TableHead className="h-12 px-6 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Team Name
                  </div>
                </TableHead>
                <TableHead className="h-12 px-6 text-gray-700 font-semibold text-sm uppercase tracking-wider">Short Name</TableHead>
                <TableHead className="h-12 px-6 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Players Count
                  </div>
                </TableHead>
                <TableHead className="h-12 px-6 text-center text-gray-700 font-semibold text-sm uppercase tracking-wider">Actions</TableHead>
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
                        <div className="bg-gray-200 p-2 rounded">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {team.name}
                          </div>
                          {team.logo && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              Logo configured
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="font-mono text-gray-700 text-sm font-semibold">{team.shortName}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="text-gray-700 text-sm font-medium">{team.playerCount || 0}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditTeam(team)}
                        className="hover:bg-gray-100 font-medium"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
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

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editMode ? 'Edit Team' : 'Add New Team'}
            </DialogTitle>
            <DialogDescription className="text-base">
              Enter the official details for this team as they should appear across the scoreboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-6 py-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Team Name
              </label>
              <Input
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                placeholder="Enter team name"
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Short Name (3-4 letters)</label>
              <Input
                value={newTeam.shortName}
                onChange={(e) => setNewTeam({ ...newTeam, shortName: e.target.value.toUpperCase() })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                size="small"
              >
                {newTeam.logo ? 'Change Logo' : 'Upload Logo'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    // For both create and update, keep file in state and preview locally
                    setLogoFile(file);
                    const previewUrl = URL.createObjectURL(file);
                    setNewTeam({ ...newTeam, logo: previewUrl });
                  }}
                />
              </Button>
              {newTeam.logo && (
                <>
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    Logo preview:
                  </Typography>
                  <img
                    src={newTeam.logo}
                    alt="Team logo preview"
                    style={{ marginTop: 4, width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }}
                  />
                </>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!newTeam.name.trim() || !newTeam.shortName.trim()}
          >
            {editMode ? 'Update Team' : 'Add Team'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminTeams;
