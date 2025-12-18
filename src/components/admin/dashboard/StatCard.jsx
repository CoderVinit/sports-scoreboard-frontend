import { Box, Typography } from '@mui/material';

const StatCard = ({ title, value, icon: Icon, gradient, bgColor, iconColor, pulse }) => {
  return (
    <Box sx={{ 
      bgcolor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
      }
    }}>
      {/* Gradient Header Bar */}
      <Box sx={{ 
        height: 4,
        background: gradient
      }} />
      
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography sx={{ 
              color: '#64748b', 
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1
            }}>
              {title}
            </Typography>
            <Typography sx={{ 
              color: '#1e293b', 
              fontSize: '2rem',
              fontWeight: 800,
              lineHeight: 1
            }}>
              {value}
            </Typography>
            {pulse && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5, 
                mt: 1 
              }}>
                <Box sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#ef4444',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.5, transform: 'scale(1.2)' }
                  }
                }} />
                <Typography sx={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 600 }}>
                  Live Now
                </Typography>
              </Box>
            )}
          </Box>
          
          <Box sx={{ 
            width: 48,
            height: 48,
            borderRadius: '14px',
            background: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={24} style={{ color: iconColor }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StatCard;
