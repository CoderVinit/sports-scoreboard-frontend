import { Box, Tabs, Tab } from '@mui/material';

const MatchTabs = ({ tabValue, onTabChange }) => {
  return (
    <Box sx={{ 
      borderBottom: 2, 
      borderColor: '#1976d2',
      mb: 3,
      bgcolor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Tabs 
        value={tabValue} 
        onChange={onTabChange}
        sx={{
          '& .MuiTab-root': {
            color: '#666',
            fontWeight: 600,
            fontSize: '0.95rem',
            textTransform: 'none',
            minHeight: 48,
            '&.Mui-selected': {
              color: '#1976d2',
              fontWeight: 700
            }
          },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
            bgcolor: '#1976d2'
          }
        }}
      >
        <Tab label="Scorecard" />
        <Tab label="Commentary" />
        <Tab label="Statistics" />
        <Tab label="Squads" />
      </Tabs>
    </Box>
  );
};

export default MatchTabs;
