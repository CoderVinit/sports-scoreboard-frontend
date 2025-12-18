import { Card, Box, Typography, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Partnerships = ({ partnerships, isOpen, onToggle }) => {
  const getOrdinalSuffix = (num) => {
    if (num === 1) return 'st';
    if (num === 2) return 'nd';
    if (num === 3) return 'rd';
    return 'th';
  };

  return (
    <Card sx={{ overflow: 'hidden' }}>
      <Box sx={{ 
        p: 2, 
        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '0.3px' }}>
          Partnerships
        </Typography>
        <IconButton onClick={onToggle} sx={{ color: 'white' }} size="small">
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2 }}>
          {partnerships?.length > 0 ? partnerships.map((partnership, index) => (
            <Box 
              key={index} 
              sx={{ 
                mb: 2, 
                pb: 2, 
                borderBottom: index < partnerships.length - 1 ? '1px solid #eee' : 'none' 
              }}
            >
              <Typography variant="body1" fontWeight="bold">
                {partnership.wicketNumber === 0 
                  ? 'Current' 
                  : `${partnership.wicketNumber}${getOrdinalSuffix(partnership.wicketNumber)} Wicket`
                }: {partnership.runs} runs ({partnership.balls} balls)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {partnership.batsman1?.name} {partnership.batsman1Runs}*, {partnership.batsman2?.name} {partnership.batsman2Runs}*
              </Typography>
            </Box>
          )) : (
            <Typography variant="body2" color="text.secondary">No partnership data available</Typography>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};

export default Partnerships;
