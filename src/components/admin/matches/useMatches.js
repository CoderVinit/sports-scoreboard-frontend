import { useState, useEffect } from 'react';
import { matchService, teamService } from '../../../api/services';

export const useMatches = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    const [m, t] = await Promise.all([
      matchService.getAllMatches(),
      teamService.getAllTeams()
    ]);
    setMatches(m.data || m.matches || []);
    setTeams(t.data || t.teams || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { matches, teams, loading, fetchAll };
};
