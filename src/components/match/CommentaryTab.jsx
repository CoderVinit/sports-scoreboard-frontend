import { Paper, Box, Typography, Chip } from '@mui/material';

const CommentaryTab = ({ commentary }) => {
  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      <Box sx={{ 
        p: 2.5, 
        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
        color: 'white'
      }}>
        <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '0.3px' }}>
          Live Commentary
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        {commentary && commentary.length > 0 ? commentary.map((comment, index) => (
          <Box 
            key={comment.id || index} 
            sx={{ 
              mb: 2, 
              pb: 2, 
              borderBottom: index < commentary.length - 1 ? 1 : 0, 
              borderColor: 'divider' 
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Chip 
                label={`${comment.overNumber || comment.over}`}
                size="small" 
                color="primary" 
                sx={{ fontWeight: 'bold' }}
              />
              {comment.isWicket && (
                <Chip label="WICKET" size="small" color="error" />
              )}
              {comment.runs && !(comment.isWicket) && (
                <Chip label={`${comment.runs}`} size="small" color="success" />
              )}
            </Box>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {comment.text || comment.commentary || 'No commentary available'}
            </Typography>
            {comment.commentary && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {comment.bowler} to {comment.batsman}
              </Typography>
            )}
          </Box>
        )) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No commentary available yet. Start recording balls to see commentary.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default CommentaryTab;
