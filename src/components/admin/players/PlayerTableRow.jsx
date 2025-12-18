import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { TableCell, TableRow } from '../../ui/table';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Badge } from '../../ui/badge';

const roleVariant = role => {
  switch (role) {
    case 'batsman':
      return 'default';
    case 'bowler':
      return 'secondary';
    case 'all-rounder':
      return 'outline';
    case 'wicket-keeper':
      return 'destructive';
    default:
      return 'default';
  }
};

const PlayerTableRow = ({ player, index, onEdit, onDelete }) => {
  return (
    <TableRow
      className={`
        transition-all
        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
        hover:bg-amber-50
        group
      `}
    >
      {/* Player */}
      <TableCell className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            {player.photo && <AvatarImage src={player.photo} />}
            <AvatarFallback className="font-semibold">
              {player.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-semibold text-gray-900 leading-none">
              {player.name}
            </p>
            {player.nationality && (
              <p className="text-xs text-gray-500 mt-1">
                {player.nationality}
              </p>
            )}
          </div>
        </div>
      </TableCell>

      {/* Team */}
      <TableCell className="px-6 py-4 text-gray-700">
        {player.team?.name || '—'}
      </TableCell>

      {/* Jersey */}
      <TableCell className="px-6 py-4 font-mono text-gray-700">
        {player.jerseyNumber ? `#${player.jerseyNumber}` : '—'}
      </TableCell>

      {/* Role */}
      <TableCell className="px-6 py-4">
        <Badge variant={roleVariant(player.role)} className="capitalize">
          {player.role?.replace('-', ' ')}{player.isCaptain ? ' / Captain' : ''}
        </Badge>
      </TableCell>

      {/* Actions */}
      <TableCell className="px-6 py-4 text-center">
        <div className="flex justify-center gap-2 opacity-70 group-hover:opacity-100 transition">
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-blue-600 hover:text-white rounded-lg"
            onClick={() => onEdit(player)}
          >
            <Edit size={16} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-red-600 hover:text-white rounded-lg"
            onClick={() => onDelete(player.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PlayerTableRow;
