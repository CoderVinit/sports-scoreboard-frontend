import { Card, Box, Typography, IconButton, Collapse, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const FallOfWickets = ({ fallOfWickets, isOpen, onToggle }) => {
  return (
    <Card sx={{ mb: 3, overflow: 'hidden' }}>
      <Box sx={{ 
        p: 2, 
        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '0.3px' }}>
          Fall of Wickets
        </Typography>
        <IconButton onClick={onToggle} sx={{ color: 'white' }} size="small">
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {fallOfWickets?.length > 0 ? fallOfWickets.map((fow, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Typography variant="body2" fontWeight="bold">
                  {fow.teamScore}-{fow.wicket} ({fow.over} ov)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {fow.playerName || fow.player?.name}
                </Typography>
              </Grid>
            )) : (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  No wickets fallen yet
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Collapse>
    </Card>
  );
};

export default FallOfWickets;
