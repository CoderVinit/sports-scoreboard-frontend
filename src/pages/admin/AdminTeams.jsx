import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchTeams, createTeam } from '../../features/teams/teamSlice';
import TeamsHeader from '../../components/admin/teams/TeamHeader';
import TeamsTable from '../../components/admin/teams/TeamsTable';
import TeamDialog from '../../components/admin/teams/TeamDialog';
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
    logo: '',
  });

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  const handleCreate = async () => {
    await dispatch(createTeam(newTeam));
    handleClose();
    dispatch(fetchTeams());
  };

  const handleEdit = (team) => {
    setSelectedTeam(team);
    setNewTeam({
      name: team.name,
      shortName: team.shortName,
      logo: team.logo || '',
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleUpdate = async () => {
    await fetch(`${API_BASE_URL}/teams/${selectedTeam.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTeam),
    });
    handleClose();
    dispatch(fetchTeams());
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedTeam(null);
    setNewTeam({ name: '', shortName: '', logo: '' });
  };

  return (
    <AdminLayout
      title="Teams"
      subtitle="Add and manage teams used across all matches."
    >
      <TeamsHeader
        count={teams?.length || 0}
        onAdd={() => setOpenDialog(true)}
      />

      <TeamsTable teams={teams} onEdit={handleEdit} />

      <TeamDialog
        open={openDialog}
        editMode={editMode}
        team={newTeam}
        setTeam={setNewTeam}
        onClose={handleClose}
        onSubmit={editMode ? handleUpdate : handleCreate}
      />
    </AdminLayout>
  );
};

export default AdminTeams;
