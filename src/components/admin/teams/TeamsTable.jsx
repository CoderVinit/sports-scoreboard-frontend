import { Users, Edit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TeamsTable = ({ teams = [], onEdit }) => {
  return (
    <Card className="bg-white shadow-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>
                <Users className="w-4 h-4 inline mr-2" /> Team
              </TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Players</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {teams.length ? (
              teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {team.logo && <AvatarImage src={team.logo} />}
                        <AvatarFallback>
                          {team.shortName?.[0] || team.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">{team.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{team.shortName}</TableCell>
                  <TableCell>{team.playerCount || 0}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(team)}
                      className="cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-16">
                  No teams available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default TeamsTable;
