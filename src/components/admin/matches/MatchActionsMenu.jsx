import { MoreVertical, Edit, Clipboard, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { matchService } from '../../../api/services';

const MatchActionsMenu = ({ match, onEdit, onRefresh, navigate }) => {
  const markCompleted = async () => {
    await matchService.updateMatch(match.id, { status: 'completed' });
    onRefresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 w-9 cursor-pointer">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(match)} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>

        {match.status === 'live' && (
          <>
            <DropdownMenuItem
              onClick={() => navigate(`/admin/score-entry/${match.id}`)}
              className="cursor-pointer"
            >
              <Clipboard className="mr-2 h-4 w-4" /> Score Entry
            </DropdownMenuItem>

            <DropdownMenuItem onClick={markCompleted} className="cursor-pointer">
              <CheckCircle className="mr-2 h-4 w-4" /> Mark Completed
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MatchActionsMenu;
