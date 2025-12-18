import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import CricketLoader from '../../components/CricketLoader';
import { useMatches } from '../../components/admin/matches/useMatches';

import MatchesHeader from '../../components/admin/matches/MatchesHeader';
import MatchesTable from '../../components/admin/matches/MatchesTable';
import MatchDialog from '../../components/admin/matches/MatchDialog';

const AdminMatchesStatic = () => {
  const navigate = useNavigate();
  const { matches, teams, loading, fetchAll } = useMatches();

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  if (loading) {
    return (
      <AdminLayout title="Matches">
        <CricketLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Matches"
      subtitle="Create and maintain fixtures for the tournament."
    >
      <MatchesHeader
        total={matches.length}
        onCreate={() => {
          setEditMode(false);
          setSelectedMatch(null);
          setOpenDialog(true);
        }}
      />

      <MatchesTable
        matches={matches}
        onEdit={(m) => {
          setSelectedMatch(m);
          setEditMode(true);
          setOpenDialog(true);
        }}
        onRefresh={fetchAll}
        navigate={navigate}
      />

      <MatchDialog
        open={openDialog}
        editMode={editMode}
        match={selectedMatch}
        teams={teams}
        onClose={() => setOpenDialog(false)}
        onSuccess={fetchAll}
      />
    </AdminLayout>
  );
};

export default AdminMatchesStatic;
