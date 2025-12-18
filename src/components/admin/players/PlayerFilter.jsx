import { Filter } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';


const PlayersFilter = ({ teams, value, onChange }) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4 flex items-center gap-3">
        <Filter className="w-5 h-5 text-gray-400" />
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {teams.map(team => (
              <SelectItem key={team.id} value={team.id.toString()}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default PlayersFilter;
