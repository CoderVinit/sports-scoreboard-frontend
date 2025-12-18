import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Typography,
  Button as MuiButton,
} from '@mui/material';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/config/api.config';

const TeamDialog = ({ open, editMode, team, setTeam, onClose, onSubmit }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editMode ? 'Edit Team' : 'Add New Team'}</DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Enter official team details.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Team Name"
              value={team.name}
              onChange={(e) =>
                setTeam({ ...team, name: e.target.value })
              }
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Short Name"
              value={team.shortName}
              inputProps={{ maxLength: 4 }}
              onChange={(e) =>
                setTeam({
                  ...team,
                  shortName: e.target.value.toUpperCase(),
                })
              }
            />
          </Grid>
        </Grid>

        <div className="mt-4">
          <Button variant="outline" asChild={false}>
            <label className="cursor-pointer">
              Upload Logo
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append('image', file);

                  const res = await fetch(
                    `${API_BASE_URL}/upload/image`,
                    { method: 'POST', body: formData }
                  );
                  const data = await res.json();
                  if (data?.url) {
                    setTeam({ ...team, logo: data.url });
                  }
                }}
              />
            </label>
          </Button>
        </div>
      </DialogContent>

      <DialogActions>
        <MuiButton onClick={onClose}>Cancel</MuiButton>
        <MuiButton
          variant="contained"
          onClick={onSubmit}
          disabled={!team.name || !team.shortName}
        >
          {editMode ? 'Update Team' : 'Add Team'}
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
};

export default TeamDialog;
