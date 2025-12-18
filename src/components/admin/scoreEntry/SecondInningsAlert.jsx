import { Box, Typography, Button } from '@mui/material';
import { AlertCircle, ArrowRight } from 'lucide-react';

const SecondInningsAlert = ({ target, onStartSecondInnings, loading }) => {
  return (
    <Box sx={{ 
      bgcolor: 'white',
      borderRadius: '16px',
      border: '1px solid #fbbf24',
      boxShadow: '0 4px 16px rgba(251, 191, 36, 0.2)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2.5,
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: '10px',
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AlertCircle size={22} style={{ color: 'white' }} />
        </Box>
        <Box>
          <Typography sx={{ 
            color: 'white', 
            fontWeight: 700, 
            fontSize: '1.1rem'
          }}>
            First Innings Complete
          </Typography>
          <Typography sx={{ 
            color: 'rgba(255,255,255,0.85)', 
            fontSize: '0.85rem'
          }}>
            Ready to start second innings
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Target Score Display */}
        <Box sx={{
          p: 3,
          borderRadius: '14px',
          bgcolor: '#fffbeb',
          border: '2px solid #fde68a',
          textAlign: 'center',
          mb: 3
        }}>
          <Typography sx={{ 
            color: '#92400e', 
            fontSize: '0.85rem',
            fontWeight: 600,
            mb: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Target Score
          </Typography>
          <Typography sx={{ 
            fontSize: '3.5rem', 
            fontWeight: 800, 
            color: '#d97706',
            lineHeight: 1
          }}>
            {target}
          </Typography>
          <Typography sx={{ 
            color: '#78716c', 
            fontSize: '0.8rem',
            fontWeight: 500,
            mt: 1
          }}>
            runs needed to win
          </Typography>
        </Box>

        {/* Info Text */}
        <Typography sx={{ 
          color: '#64748b', 
          fontSize: '0.9rem',
          textAlign: 'center',
          mb: 3
        }}>
          Click the button below to initialize the second innings and start scoring.
        </Typography>

        {/* Start Second Innings Button */}
        <Button
          fullWidth
          onClick={onStartSecondInnings}
          disabled={loading}
          endIcon={<ArrowRight size={20} />}
          sx={{
            py: 2,
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '1rem',
            textTransform: 'none',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(245, 158, 11, 0.5)'
            },
            '&.Mui-disabled': {
              background: '#e2e8f0',
              color: '#94a3b8'
            }
          }}
        >
          {loading ? 'Starting...' : 'Start Second Innings'}
        </Button>
      </Box>
    </Box>
  );
};

export default SecondInningsAlert;
