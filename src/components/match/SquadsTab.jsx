import { Paper, Box, Typography, IconButton, Collapse, Grid, Avatar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const TeamSquad = ({ team, squad, isOpen, onToggle }) => {
  const getRoleSuffix = (role) => {
    if (role?.toLowerCase().includes('captain')) return ' (c)';
    if (role?.toLowerCase().includes('wicket')) return ' (wk)';
    return '';
  };

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      {/* Team Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
        color: 'white', 
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 40,
            height: 28,
            bgcolor: 'white',
            borderRadius: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            🏏
          </Box>
          <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {team?.name || 'Team'}
          </Typography>
        </Box>
        <IconButton onClick={onToggle} sx={{ color: 'white' }} size="small">
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        {/* Squads Label */}
        <Box sx={{ bgcolor: '#f5f5f5', px: 2.5, py: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#333', letterSpacing: '0.5px' }}>
            SQUADS
          </Typography>
        </Box>

        {/* Players List */}
        <Box sx={{ bgcolor: 'white' }}>
          {squad.length > 0 ? squad.map((player) => (
            <Box
              key={player.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                px: 2.5,
                py: 2,
                borderBottom: '1px solid #e0e0e0',
                '&:last-child': { borderBottom: 'none' },
                '&:hover': { bgcolor: '#fafafa' }
              }}
            >
              <Avatar
                sx={{
                  bgcolor: '#d0d0d0',
                  width: 40,
                  height: 40,
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: '#666'
                }}
              >
                {player.name.charAt(0)}
              </Avatar>
              <Typography variant="body1" fontWeight="600" sx={{ color: '#000' }}>
                {player.name}{getRoleSuffix(player.role)}
              </Typography>
            </Box>
          )) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No squad information available
              </Typography>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

const SquadsTab = ({ 
  match, 
  team1Squad, 
  team2Squad, 
  team1SquadOpen, 
  team2SquadOpen,
  onTeam1Toggle,
  onTeam2Toggle 
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Grid container spacing={0} sx={{ maxWidth: '1800px' }}>
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ pr: { md: 1 } }}>
          <TeamSquad 
            team={match.team1}
            squad={team1Squad}
            isOpen={team1SquadOpen}
            onToggle={onTeam1Toggle}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ pl: { md: 1 } }}>
          <TeamSquad 
            team={match.team2}
            squad={team2Squad}
            isOpen={team2SquadOpen}
            onToggle={onTeam2Toggle}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SquadsTab;
