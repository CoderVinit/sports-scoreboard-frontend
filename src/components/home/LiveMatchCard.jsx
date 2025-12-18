import { Link } from "react-router-dom";
import { Box, Card, CardContent, Typography, Chip, Avatar, LinearProgress } from "@mui/material";
import { MapPin, Radio, TrendingUp } from "lucide-react";

const LiveMatchCard = ({ match }) => {
  const inningsList = match.innings || [];
  const firstInnings =
    inningsList.find((inn) => inn.inningsNumber === 1) ||
    inningsList[0] ||
    null;
  const secondInnings =
    inningsList.find((inn) => inn.inningsNumber === 2) ||
    (inningsList.length > 1 ? inningsList[1] : null);
  const currentInnings =
    inningsList.find((inn) => inn.status === "in_progress") ||
    inningsList.find((inn) => inn.inningsNumber === match.currentInnings) ||
    inningsList[inningsList.length - 1] ||
    inningsList[0] ||
    null;
  const totalOvers =
    match.totalOvers ||
    (match.matchFormat === "T20" ? 20 : match.matchFormat === "ODI" ? 50 : 90);
  const progress = currentInnings
    ? (parseFloat(currentInnings.totalOvers || 0) / totalOvers) * 100
    : 0;

  const isTeam1Batting = currentInnings?.battingTeamId === match.team1Id;
  const battingTeam = isTeam1Batting ? match.team1 : match.team2;
  const bowlingTeam = isTeam1Batting ? match.team2 : match.team1;
  const battingScore = currentInnings || { totalRuns: 0, totalWickets: 0 };
  const bowlingScore = inningsList.find(
    (inn) => inn.id !== currentInnings?.id
  ) || { totalRuns: 0, totalWickets: 0 };

  const isCompletedByInnings = !!(
    firstInnings &&
    secondInnings &&
    secondInnings.status === "completed"
  );
  const winnerTeam =
    match.winnerId === match.team1Id
      ? match.team1
      : match.winnerId === match.team2Id
      ? match.team2
      : null;

  let resultText = "";
  if (isCompletedByInnings) {
    if (winnerTeam && match.winMargin) {
      resultText = `${winnerTeam.shortName || winnerTeam.name} won by ${match.winMargin}`;
    } else {
      const firstRuns = firstInnings?.totalRuns || 0;
      const secondRuns = secondInnings?.totalRuns || 0;
      const target = secondInnings?.target || firstRuns + 1;

      if (secondRuns >= target) {
        const wicketsRemaining = 10 - (secondInnings?.totalWickets || 0);
        const chasingTeam =
          secondInnings.battingTeamId === match.team1Id
            ? match.team1
            : match.team2;
        const wk = wicketsRemaining > 0 ? wicketsRemaining : 1;
        resultText = `${chasingTeam.shortName || chasingTeam.name} won by ${wk} wicket${wk === 1 ? "" : "s"}`;
      } else if (firstRuns > secondRuns) {
        const margin = firstRuns - secondRuns;
        const defendingTeam =
          firstInnings.battingTeamId === match.team1Id
            ? match.team1
            : match.team2;
        resultText = `${defendingTeam.shortName || defendingTeam.name} won by ${margin} run${margin === 1 ? "" : "s"}`;
      } else if (firstRuns === secondRuns) {
        resultText = "Match tied";
      }
    }
  }

  return (
    <Link to={`/match/${match.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <Card
        sx={{
          height: '100%',
          bgcolor: 'background.paper',
          transition: 'all 0.3s ease',
          border: '1px solid',
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
            transform: 'translateY(-4px)',
          },
        }}
      >
        {/* Live Badge */}
        <Chip
          icon={<Radio style={{ width: 14, height: 14, color: 'white' }} />}
          label="LIVE"
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.7rem',
            animation: 'pulse 2s ease-in-out infinite',
            boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
          }}
        />

        <CardContent sx={{ pt: 2, pb: 1.5, px: 2 }}>
          {/* Match meta */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pr: 8, flexWrap: 'wrap' }}>
            <Chip
              label={match.matchFormat || match.matchType}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.65rem', fontWeight: 500, height: 22 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', overflow: 'hidden' }}>
              <MapPin style={{ width: 12, height: 12 }} />
              <Typography variant="caption" sx={{ 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap',
                maxWidth: 150 
              }}>
                {match.venue}
              </Typography>
            </Box>
          </Box>

          {/* Teams row */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Batting Team */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)',
                p: 2,
                borderRadius: 3,
                boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1, position: 'relative', zIndex: 1 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    border: '2px solid rgba(255,255,255,0.4)',
                    flexShrink: 0,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: 'white',
                  }}
                >
                  {(battingTeam?.shortName || battingTeam?.name || "BAT")
                    .substring(0, 3)
                    .toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {battingTeam?.shortName || battingTeam?.name || "Team"}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: 'rgba(199, 210, 254, 1)', fontWeight: 500 }}>
                    Batting
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right', flexShrink: 0, position: 'relative', zIndex: 1 }}>
                <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', lineHeight: 1, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                  {`${battingScore.totalRuns || 0}/${battingScore.totalWickets || 0}`}
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: 'rgba(199, 210, 254, 1)', mt: 0.5, fontWeight: 500 }}>
                  ({battingScore.totalOvers || "0.0"}/{totalOvers})
                </Typography>
              </Box>
            </Box>

            {/* Bowling Team */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(241, 245, 249, 1)',
                border: '2px solid',
                borderColor: 'divider',
                p: 2,
                borderRadius: 3,
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                transition: 'border-color 0.3s ease',
                '&:hover': {
                  borderColor: 'divider',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                    flexShrink: 0,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: 'white',
                  }}
                >
                  {(bowlingTeam?.shortName || bowlingTeam?.name || "BWL")
                    .substring(0, 3)
                    .toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {bowlingTeam?.shortName || bowlingTeam?.name || "Team"}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 500 }}>
                    Bowling
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'text.primary' }}>
                  {bowlingScore.totalRuns > 0 ? (
                    `${bowlingScore.totalRuns || 0}/${bowlingScore.totalWickets || 0}`
                  ) : (
                    <Typography component="span" sx={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '0.9rem' }}>
                      Yet to bat
                    </Typography>
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Match Progress */}
          {!isCompletedByInnings && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">Progress</Typography>
                <Typography variant="caption" color="text.secondary">
                  {currentInnings?.totalOvers || "0.0"}/{totalOvers} ov
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                    borderRadius: 3,
                  }
                }} 
              />
            </Box>
          )}

          {/* Stats footer */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              mt: 2, 
              pt: 1.5, 
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
              <TrendingUp style={{ width: 12, height: 12, color: '#6366f1' }} />
              <Typography variant="caption">
                CRR:{" "}
                <Typography component="span" variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  {(() => {
                    const overs = parseFloat(currentInnings?.totalOvers || 0);
                    const runs = currentInnings?.totalRuns || 0;
                    return overs > 0 ? (runs / overs).toFixed(2) : "0.00";
                  })()}
                </Typography>
              </Typography>
            </Box>
            {isCompletedByInnings && resultText ? (
              <Chip
                label={resultText}
                size="small"
                sx={{
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  bgcolor: 'rgba(34, 197, 94, 0.1)',
                  color: '#16a34a',
                  height: 22,
                  maxWidth: '50%',
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }
                }}
              />
            ) : (
              <Chip
                label="In progress"
                size="small"
                sx={{
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  bgcolor: 'rgba(245, 158, 11, 0.1)',
                  color: '#d97706',
                  height: 22,
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default LiveMatchCard;
