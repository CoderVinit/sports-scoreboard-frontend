import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { playerService, teamService } from '../../api/services';
import CricketLoader from '../../components/CricketLoader';
import PlayersHeader from '../../components/admin/players/PlayerHeader';
import PlayersFilter from '../../components/admin/players/PlayerFilter';
import PlayersTable from '../../components/admin/players/PlayerTable';
import PlayerDialog from '../../components/admin/players/PlayerDialog';

const INITIAL_PLAYER_STATE = {
  name: '',
  teamId: '',
  jerseyNumber: '',
  role: 'batsman',
  battingStyle: '',
  bowlingStyle: '',
  dateOfBirth: '',
  nationality: '',
  isCaptain: false
};

const AdminPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('all');
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const [newPlayer, setNewPlayer] = useState(INITIAL_PLAYER_STATE);

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  /* ---------------- API CALLS ---------------- */

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const res = await playerService.getAllPlayers();
      setPlayers(res.data || res);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    const res = await teamService.getAllTeams();
    setTeams(res.data || res);
  };

  /* ---------------- DIALOG HANDLERS ---------------- */

  const handleOpenDialog = (player = null) => {
    if (player) {
      setEditMode(true);
      setCurrentPlayer(player);
      setNewPlayer({
        ...INITIAL_PLAYER_STATE,
        ...player,
        teamId: player.teamId?.toString() || '',
        jerseyNumber: player.jerseyNumber?.toString() || '',
        isCaptain: Boolean(player.isCaptain)
      });
    } else {
      setEditMode(false);
      setCurrentPlayer(null);
      setNewPlayer(INITIAL_PLAYER_STATE);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentPlayer(null);
    setNewPlayer(INITIAL_PLAYER_STATE);
  };

  /* ---------------- SAVE PLAYER ---------------- */

  const handleSavePlayer = async () => {
    const payload = {
      ...newPlayer,
      teamId: Number(newPlayer.teamId),
      jerseyNumber: newPlayer.jerseyNumber
        ? Number(newPlayer.jerseyNumber)
        : null,
      isCaptain: Boolean(newPlayer.isCaptain)
    };

    try {
      setLoading(true);
      if (editMode && currentPlayer) {
        await playerService.updatePlayer(currentPlayer.id, payload);
      } else {
        await playerService.createPlayer(payload);
      }

      handleCloseDialog();
      fetchPlayers();
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTER ---------------- */

  const filteredPlayers =
    selectedTeamId === 'all'
      ? players
      : players.filter(
          p => Number(p.teamId) === Number(selectedTeamId)
        );

  /* ---------------- LOADER ---------------- */

  if (loading && players.length === 0) {
    return (
      <AdminLayout title="Players">
        <CricketLoader />
      </AdminLayout>
    );
  }

  /* ---------------- RENDER ---------------- */

  return (
    <AdminLayout title="Players" subtitle="Maintain player profiles">
      <PlayersHeader
        total={players.length}
        visible={filteredPlayers.length}
        onAdd={() => handleOpenDialog()}
      />

      <PlayersFilter
        teams={teams}
        value={selectedTeamId}
        onChange={setSelectedTeamId}
      />

      <PlayersTable
        players={filteredPlayers}
        onEdit={handleOpenDialog}
        onDelete={id =>
          playerService.deletePlayer(id).then(fetchPlayers)
        }
      />

      <PlayerDialog
        open={openDialog}
        editMode={editMode}
        player={newPlayer}
        teams={teams}
        loading={loading}
        onChange={setNewPlayer}
        onClose={handleCloseDialog}
        onSave={handleSavePlayer}
      />
    </AdminLayout>
  );
};

export default AdminPlayers;
