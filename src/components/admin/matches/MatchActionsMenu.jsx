import { 
  Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText
} from '@mui/material';
import { useState } from 'react';
import { MoreVertical, Edit, Clipboard, CheckCircle, Play } from 'lucide-react';
import { matchService } from '../../../api/services';

const MatchActionsMenu = ({ match, onEdit, onRefresh, navigate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const startMatch = async () => {
    try {
      await matchService.startMatch(match.id);
      onRefresh();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to start match. Please ensure toss details are complete.');
    }
    handleClose();
  };

  const markCompleted = async () => {
    await matchService.updateMatch(match.id, { status: 'completed' });
    onRefresh();
    handleClose();
  };

  const menuItemStyle = {
    py: 1.5,
    px: 2,
    '&:hover': {
      bgcolor: '#f8fafc'
    }
  };

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        sx={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          '&:hover': {
            bgcolor: '#f1f5f9'
          }
        }}
      >
        <MoreVertical size={18} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            border: '1px solid #e2e8f0',
            minWidth: 180,
            mt: 1
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem 
          onClick={() => { onEdit(match); handleClose(); }}
          sx={menuItemStyle}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Edit size={16} style={{ color: '#64748b' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Edit" 
            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
          />
        </MenuItem>

        {match.status === 'scheduled' && (
          <MenuItem 
            onClick={startMatch}
            sx={{
              ...menuItemStyle,
              color: '#22c55e',
              '&:hover': { bgcolor: '#f0fdf4' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Play size={16} style={{ color: '#22c55e' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Start Match" 
              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
            />
          </MenuItem>
        )}

        {match.status === 'live' && (
          <>
            <MenuItem 
              onClick={() => { navigate(`/admin/score-entry/${match.id}`); handleClose(); }}
              sx={menuItemStyle}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Clipboard size={16} style={{ color: '#64748b' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Score Entry" 
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
              />
            </MenuItem>

            <MenuItem 
              onClick={markCompleted}
              sx={{
                ...menuItemStyle,
                '&:hover': { bgcolor: '#fef3c7' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircle size={16} style={{ color: '#f59e0b' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Mark Completed" 
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
              />
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default MatchActionsMenu;
