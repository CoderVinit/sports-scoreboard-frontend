import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

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
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl
    w-[95vw]
    mt-8 sm:mt-10
    max-h-[calc(100vh-10rem)]
    p-0
    flex
    flex-col"
      >
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b bg-gray-50">
          <DialogTitle className="text-2xl font-bold">
            {editMode ? "Edit Player" : "Add New Player"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            This information will be used across scorecards and statistics.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Basic Info */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
              Player Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Player Name *</label>
                <Input
                  value={player.name || ""}
                  onChange={(e) =>
                    onChange({ ...player, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  className="h-11"
                />
              </div>

              <div>
                <label className="form-label">Team *</label>
                <Select
                  value={player.teamId?.toString() || ""}
                  onValueChange={(value) =>
                    onChange({ ...player, teamId: value })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="form-label">Jersey Number</label>
                <Input
                  type="number"
                  value={player.jerseyNumber || ""}
                  onChange={(e) =>
                    onChange({
                      ...player,
                      jerseyNumber: e.target.value,
                    })
                  }
                  placeholder="e.g. 18"
                  className="h-11"
                />
              </div>

              <div>
                <label className="form-label">Nationality</label>
                <Input
                  value={player.nationality || ""}
                  onChange={(e) =>
                    onChange({
                      ...player,
                      nationality: e.target.value,
                    })
                  }
                  placeholder="e.g. Indian"
                  className="h-11"
                />
              </div>
            </div>
          </section>

          {/* Role Info */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
              Playing Role
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="form-label">Role *</label>
                <Select
                  value={player.role}
                  onValueChange={(value) =>
                    onChange({ ...player, role: value })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="batsman">Batsman</SelectItem>
                    <SelectItem value="bowler">Bowler</SelectItem>
                    <SelectItem value="all-rounder">All-Rounder</SelectItem>
                    <SelectItem value="wicket-keeper">Wicket-Keeper</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="form-label">Batting Style</label>
                <Select
                  value={player.battingStyle || "none"}
                  onValueChange={(value) =>
                    onChange({
                      ...player,
                      battingStyle: value === "none" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="right-hand">Right Hand</SelectItem>
                    <SelectItem value="left-hand">Left Hand</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="form-label">Bowling Style</label>
                <Select
                  value={player.bowlingStyle || "none"}
                  onValueChange={(value) =>
                    onChange({
                      ...player,
                      bowlingStyle: value === "none" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="right-arm-fast">
                      Right Arm Fast
                    </SelectItem>
                    <SelectItem value="left-arm-fast">Left Arm Fast</SelectItem>
                    <SelectItem value="right-arm-off-spin">Off Spin</SelectItem>
                    <SelectItem value="right-arm-leg-spin">Leg Spin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Captain */}
            <div>
              <label className="form-label">Captain</label>
              <Select
                value={player.isCaptain ? "yes" : "no"}
                onValueChange={(value) =>
                  onChange({
                    ...player,
                    isCaptain: value === "yes",
                  })
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes (Team Captain)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Meta */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
              Additional Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Date of Birth</label>
                <Input
                  type="date"
                  value={player.dateOfBirth || ""}
                  onChange={(e) =>
                    onChange({
                      ...player,
                      dateOfBirth: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="h-11 px-6">
            Cancel
          </Button>

          <Button
            onClick={onSave}
            disabled={loading || !player.name || !player.teamId}
            className="h-11 px-8 font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md"
          >
            {loading
              ? "Saving..."
              : editMode
              ? "Update Player"
              : "Create Player"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDialog;
