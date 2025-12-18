import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Trophy } from 'lucide-react';
import MatchActionsMenu from './MatchActionsMenu';

const MatchesTable = ({ matches, onEdit, onRefresh, navigate }) => {
  return (
    <Card className="shadow-2xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <TableHead>#</TableHead>
            <TableHead>Teams</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {matches.map((match, i) => (
            <TableRow key={match.id} className="hover:bg-blue-50">
              <TableCell>#{match.id}</TableCell>

              <TableCell>
                <strong>
                  {match.team1?.name} vs {match.team2?.name}
                </strong>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {match.series}
                </div>
              </TableCell>

              <TableCell className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                {match.venue}
              </TableCell>

              <TableCell>
                <Calendar className="inline w-4 h-4 mr-1" />
                {new Date(match.matchDate).toLocaleDateString()}
              </TableCell>

              <TableCell>
                <Badge variant={match.status === 'live' ? 'destructive' : 'secondary'}>
                  {match.status || 'scheduled'}
                </Badge>
              </TableCell>

              <TableCell className="text-center">
                <MatchActionsMenu
                  match={match}
                  onEdit={onEdit}
                  onRefresh={onRefresh}
                  navigate={navigate}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default MatchesTable;
