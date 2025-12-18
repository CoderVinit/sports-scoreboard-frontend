import { Box, Typography, FormControl, Select, MenuItem } from '@mui/material';
import { Filter } from 'lucide-react';

const PlayersFilter = ({ teams, value, onChange }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      mb: 3,
      p: 2,
      bgcolor: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Filter size={16} style={{ color: '#64748b' }} />
        <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
          Filter by team:
        </Typography>
      </Box>
      
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            borderRadius: '10px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e2e8f0'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#94a3b8'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b82f6',
              borderWidth: '1px'
            }
          }}
        >
          <MenuItem value="all">All Teams</MenuItem>
          {teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              {team.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default PlayersFilter;
