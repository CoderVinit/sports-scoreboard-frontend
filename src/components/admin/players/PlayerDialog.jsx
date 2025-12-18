import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { User, X } from 'lucide-react';

const PlayerDialog = ({
  open,
  editMode,
  player,
  teams,
  loading,
  onChange,
  onSave,
  onClose,
}) => {
  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '& fieldset': { borderColor: '#e2e8f0' },
      '&:hover fieldset': { borderColor: '#94a3b8' },
      '&.Mui-focused fieldset': { borderColor: '#f59e0b', borderWidth: '1px' }
    }
  };

  const selectStyle = {
    borderRadius: '10px',
    minWidth: '200px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f59e0b', borderWidth: '1px' },
    '& .MuiSelect-select': { minWidth: '150px' }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        p: 0,
        background: 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)',
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={22} style={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.25rem' }}>
                {editMode ? 'Edit Player' : 'Add New Player'}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                Player information for scorecards and statistics
              </Typography>
            </Box>
          </Box>
          <Box
            onClick={onClose}
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            <X size={18} style={{ color: 'white' }} />
          </Box>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 3, overflowY: 'auto', bgcolor: '#f8fafc' }}>
        {/* Player Information Section */}
        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: '16px', 
          p: 3, 
          mb: 3,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <Typography sx={{ 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            color: '#f59e0b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            mb: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Box sx={{ width: 4, height: 16, bgcolor: '#f59e0b', borderRadius: 1 }} />
            Player Information
          </Typography>
          
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Player Name"
                required
                value={player.name || ''}
                onChange={(e) => onChange({ ...player, name: e.target.value })}
                placeholder="Enter full name"
                sx={inputStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Team</InputLabel>
                <Select
                  value={player.teamId?.toString() || ''}
                  onChange={(e) => onChange({ ...player, teamId: e.target.value })}
                  label="Team"
                  sx={selectStyle}
                >
                  {teams.map((team) => (
                    <MenuItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Jersey Number"
                type="number"
                value={player.jerseyNumber || ''}
                onChange={(e) => onChange({ ...player, jerseyNumber: e.target.value })}
                placeholder="e.g. 18"
                sx={inputStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Nationality"
                value={player.nationality || ''}
                onChange={(e) => onChange({ ...player, nationality: e.target.value })}
                placeholder="e.g. Indian"
                sx={inputStyle}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Playing Role Section */}
        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: '16px', 
          p: 3, 
          mb: 3,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <Typography sx={{ 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            color: '#3b82f6',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            mb: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Box sx={{ width: 4, height: 16, bgcolor: '#3b82f6', borderRadius: 1 }} />
            Playing Role
          </Typography>
          
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Role</InputLabel>
                <Select
                  value={player.role || ''}
                  onChange={(e) => onChange({ ...player, role: e.target.value })}
                  label="Role"
                  sx={selectStyle}
                >
                  <MenuItem value="batsman">Batsman</MenuItem>
                  <MenuItem value="bowler">Bowler</MenuItem>
                  <MenuItem value="all-rounder">All-Rounder</MenuItem>
                  <MenuItem value="wicket-keeper">Wicket-Keeper</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Batting Style</InputLabel>
                <Select
                  value={player.battingStyle || ''}
                  onChange={(e) => onChange({ ...player, battingStyle: e.target.value })}
                  label="Batting Style"
                  sx={selectStyle}
                >
                  <MenuItem value="right-handed">Right-Handed</MenuItem>
                  <MenuItem value="left-handed">Left-Handed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Bowling Style</InputLabel>
                <Select
                  value={player.bowlingStyle || ''}
                  onChange={(e) => onChange({ ...player, bowlingStyle: e.target.value })}
                  label="Bowling Style"
                  sx={selectStyle}
                >
                  <MenuItem value="right-arm-fast">Right-Arm Fast</MenuItem>
                  <MenuItem value="right-arm-medium">Right-Arm Medium</MenuItem>
                  <MenuItem value="right-arm-offspin">Right-Arm Offspin</MenuItem>
                  <MenuItem value="right-arm-legspin">Right-Arm Legspin</MenuItem>
                  <MenuItem value="left-arm-fast">Left-Arm Fast</MenuItem>
                  <MenuItem value="left-arm-medium">Left-Arm Medium</MenuItem>
                  <MenuItem value="left-arm-orthodox">Left-Arm Orthodox</MenuItem>
                  <MenuItem value="left-arm-chinaman">Left-Arm Chinaman</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Additional Info Section */}
        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: '16px', 
          p: 3,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <Typography sx={{ 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            color: '#22c55e',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            mb: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Box sx={{ width: 4, height: 16, bgcolor: '#22c55e', borderRadius: 1 }} />
            Additional Information
          </Typography>
          
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Date of Birth"
                type="date"
                value={player.dateOfBirth || ''}
                onChange={(e) => onChange({ ...player, dateOfBirth: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={inputStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Captain</InputLabel>
                <Select
                  value={player.isCaptain ? 'yes' : 'no'}
                  onChange={(e) => onChange({ ...player, isCaptain: e.target.value === 'yes' })}
                  label="Captain"
                  sx={selectStyle}
                >
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ 
        p: 3, 
        borderTop: '1px solid #e2e8f0',
        gap: 1.5
      }}>
        <Button 
          onClick={onClose}
          sx={{
            px: 3,
            py: 1.25,
            borderRadius: '10px',
            fontWeight: 600,
            textTransform: 'none',
            color: '#64748b',
            border: '1px solid #e2e8f0',
            '&:hover': {
              bgcolor: '#f8fafc',
              borderColor: '#cbd5e1'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={loading || !player.name || !player.teamId || !player.role}
          sx={{
            px: 3,
            py: 1.25,
            borderRadius: '10px',
            fontWeight: 600,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            },
            '&.Mui-disabled': {
              background: '#e2e8f0',
              color: '#94a3b8'
            }
          }}
        >
          {loading ? 'Saving...' : editMode ? 'Update Player' : 'Add Player'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerDialog;
