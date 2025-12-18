import { Link } from "react-router-dom";
import { Box, Card, CardContent, Typography, Chip, Avatar } from "@mui/material";

const CompletedMatchCard = ({ match }) => {
  const inningsList = match.innings || [];
  const firstInnings =
    inningsList.find((inn) => inn.inningsNumber === 1) || inningsList[0] || null;
  const secondInnings =
    inningsList.find((inn) => inn.inningsNumber === 2) ||
    (inningsList.length > 1 ? inningsList[1] : null);

  const winnerTeam =
    match.winnerId === match.team1Id
      ? match.team1
      : match.winnerId === match.team2Id
      ? match.team2
      : null;

  const team1 = match.team1;
  const team2 = match.team2;
  const team1Innings = inningsList.find((inn) => inn.battingTeamId === match.team1Id);
  const team2Innings = inningsList.find((inn) => inn.battingTeamId === match.team2Id);

  let resultText = "";

  // Check if one team didn't bat (match withdrawn/abandoned)
  if (!team1Innings || !team2Innings) {
    resultText = "Match withdrawn due to rain";
  } else if (firstInnings && secondInnings) {
    const battedFirstTeamId = firstInnings.battingTeamId;
    const battedSecondTeamId = secondInnings.battingTeamId;

    const battedFirstTeam = battedFirstTeamId === match.team1Id ? team1 : team2;
    const battedSecondTeam = battedSecondTeamId === match.team1Id ? team1 : team2;

    const firstInningsRuns = firstInnings.totalRuns || 0;
    const secondInningsRuns = secondInnings.totalRuns || 0;
    const secondInningsWickets = secondInnings.totalWickets || 0;

    if (secondInningsRuns > firstInningsRuns) {
      const wicketsRemaining = 10 - secondInningsWickets;
      resultText = `${battedSecondTeam.shortName || battedSecondTeam.name} won by ${wicketsRemaining} wicket${wicketsRemaining === 1 ? "" : "s"}`;
    } else if (firstInningsRuns > secondInningsRuns) {
      const runMargin = firstInningsRuns - secondInningsRuns;
      resultText = `${battedFirstTeam.shortName || battedFirstTeam.name} won by ${runMargin} run${runMargin === 1 ? "" : "s"}`;
    } else {
      resultText = "Match tied";
    }
  } else if (winnerTeam && match.winMargin) {
    resultText = `${winnerTeam.shortName || winnerTeam.name} won by ${match.winMargin}`;
  }

  return (
    <Link to={`/match/${match.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <Card
        sx={{
          height: '100%',
          bgcolor: 'background.paper',
          transition: 'all 0.3s ease',
          border: '2px solid',
          borderColor: 'divider',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          '&:hover': {
            boxShadow: (theme) => 
              theme.palette.mode === 'dark' 
                ? '0 20px 40px rgba(0,0,0,0.4)' 
                : '0 20px 40px rgba(0,0,0,0.15)',
            borderColor: 'primary.main',
            transform: 'translateY(-8px)',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, pb: 1.5, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Chip
              label={match.matchFormat || match.matchType}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.65rem',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
              }}
            />
            <Chip
              label="Completed"
              size="small"
              sx={{
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '0.65rem',
              }}
            />
          </Box>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary', fontWeight: 700 }}>
            Final Scores
          </Typography>
        </Box>

        <CardContent sx={{ pt: 0, pb: 2, px: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Team 1 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.5,
              borderRadius: 2,
              background: (theme) => 
                theme.palette.mode === 'dark' 
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(239, 246, 255, 1) 0%, rgba(238, 242, 255, 1) 100%)',
              border: '1px solid',
              borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.15)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  ...(winnerTeam && winnerTeam.id === team1?.id && {
                    ring: 2,
                    boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.3), 0 4px 15px rgba(99, 102, 241, 0.3)',
                  }),
                }}
              >
                {(team1?.shortName || team1?.name || "T1").charAt(0)}
              </Avatar>
              <Typography
                sx={{
                  fontWeight: winnerTeam && winnerTeam.id === team1?.id ? 800 : 700,
                  fontSize: '0.95rem',
                  color: 'text.primary',
                }}
              >
                {team1?.shortName || team1?.name}
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: 'text.primary' }}>
              {team1Innings ? (
                `${team1Innings.totalRuns || 0}/${team1Innings.totalWickets || 0} (${team1Innings.totalOvers || "0.0"})`
              ) : (
                <Typography component="span" sx={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '0.8rem' }}>DNB</Typography>
              )}
            </Typography>
          </Box>

          {/* Team 2 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.5,
              borderRadius: 2,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(241, 245, 249, 1)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  ...(winnerTeam && winnerTeam.id === team2?.id && {
                    ring: 2,
                    boxShadow: '0 0 0 3px rgba(100, 116, 139, 0.3), 0 4px 15px rgba(100, 116, 139, 0.3)',
                  }),
                }}
              >
                {(team2?.shortName || team2?.name || "T2").charAt(0)}
              </Avatar>
              <Typography
                sx={{
                  fontWeight: winnerTeam && winnerTeam.id === team2?.id ? 800 : 700,
                  fontSize: '0.95rem',
                  color: 'text.primary',
                }}
              >
                {team2?.shortName || team2?.name}
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: 'text.primary' }}>
              {team2Innings ? (
                `${team2Innings.totalRuns || 0}/${team2Innings.totalWickets || 0} (${team2Innings.totalOvers || "0.0"})`
              ) : (
                <Typography component="span" sx={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '0.8rem' }}>DNB</Typography>
              )}
            </Typography>
          </Box>

          {resultText && (
            <Box
              sx={{
                mt: 1,
                pt: 1.5,
                borderTop: '2px solid',
                borderColor: 'divider',
                background: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(234, 179, 8, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(254, 249, 195, 1) 0%, rgba(254, 252, 232, 1) 100%)',
                borderRadius: 2,
                p: 2,
                border: '1px solid',
                borderTopColor: 'divider',
                borderLeftColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.15)',
                borderRightColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.15)',
                borderBottomColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.15)',
              }}
            >
              <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>
                Result
              </Typography>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {resultText}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default CompletedMatchCard;
