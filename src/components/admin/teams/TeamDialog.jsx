import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Grid, TextField, Button
} from '@mui/material';
import { Users, X, Upload } from 'lucide-react';
import { API_BASE_URL } from '@/config/api.config';

const TeamDialog = ({ open, editMode, team, setTeam, onClose, onSubmit }) => {
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_BASE_URL}/upload/image`, { 
        method: 'POST', 
        body: formData 
      });
      const data = await res.json();
      if (data?.url) {
        setTeam({ ...team, logo: data.url });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '& fieldset': { borderColor: '#e2e8f0' },
      '&:hover fieldset': { borderColor: '#94a3b8' },
      '&.Mui-focused fieldset': { borderColor: '#22c55e', borderWidth: '1px' }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        p: 0,
        background: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)',
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
              <Users size={22} style={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.25rem' }}>
                {editMode ? 'Edit Team' : 'Add New Team'}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                Enter official team details
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
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{mt:4}}>
          {/* Team Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Team Name *"
              value={team.name || ''}
              onChange={(e) => setTeam({ ...team, name: e.target.value })}
              placeholder="Enter team name"
              sx={inputStyle}
            />
          </Grid>

          {/* Short Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Short Name *"
              value={team.shortName || ''}
              inputProps={{ maxLength: 4 }}
              onChange={(e) => setTeam({ ...team, shortName: e.target.value.toUpperCase() })}
              placeholder="e.g. CSK, MI"
              helperText="Maximum 4 characters"
              sx={inputStyle}
            />
          </Grid>

          {/* Logo Upload */}
          <Grid item xs={12}>
            <Typography sx={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: '#374151',
              mb: 1.5
            }}>
              Team Logo
            </Typography>

            {team.logo ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                p: 2,
                borderRadius: '12px',
                bgcolor: '#f0fdf4',
                border: '1px solid #bbf7d0'
              }}>
                <Box
                  component="img"
                  src={team.logo}
                  alt="Team logo"
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '10px',
                    objectFit: 'contain',
                    bgcolor: 'white',
                    p: 0.5
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534' }}>
                    Logo uploaded
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Click below to change
                  </Typography>
                </Box>
              </Box>
            ) : null}

            <Box sx={{ mt: team.logo ? 2 : 0 }}>
              <Button
                component="label"
                disabled={uploading}
                startIcon={<Upload size={18} />}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: '10px',
                  fontWeight: 600,
                  textTransform: 'none',
                  color: '#22c55e',
                  border: '2px dashed #86efac',
                  bgcolor: '#f0fdf4',
                  width: '100%',
                  '&:hover': {
                    bgcolor: '#dcfce7',
                    borderColor: '#22c55e'
                  }
                }}
              >
                {uploading ? 'Uploading...' : team.logo ? 'Change Logo' : 'Upload Logo'}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </Button>
            </Box>
          </Grid>
        </Grid>
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
          onClick={onSubmit}
          disabled={!team.name || !team.shortName}
          sx={{
            px: 3,
            py: 1.25,
            borderRadius: '10px',
            fontWeight: 600,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            },
            '&.Mui-disabled': {
              background: '#e2e8f0',
              color: '#94a3b8'
            }
          }}
        >
          {editMode ? 'Update Team' : 'Add Team'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamDialog;
