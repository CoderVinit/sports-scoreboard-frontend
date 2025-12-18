import { User } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../../ui/table";
import PlayerTableRow from "./PlayerTableRow";


const PlayersTable = ({ players, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          {/* Header */}
          <TableHeader className="sticky top-0 z-10 bg-gray-100">
            <TableRow className="border-b border-gray-300">
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Player
                </div>
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase text-gray-700">
                Team
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase text-gray-700">
                Jersey
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase text-gray-700">
                Role
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase text-center text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody>
            {players.length > 0 ? (
              players.map((player, index) => (
                <PlayerTableRow
                  key={player.id}
                  player={player}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <TableRow>
                <td colSpan={5} className="py-16 text-center text-gray-500">
                  No players found
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PlayersTable;
