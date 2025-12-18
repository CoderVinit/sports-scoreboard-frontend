import { Plus } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';

const PlayersHeader = ({ total, visible, onAdd }) => {
  return (
    <Card className="bg-gradient-to-r from-amber-600 to-orange-600 text-white mb-6">
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Manage Players</h2>
          <p className="text-amber-100">
            {visible} of {total} players
          </p>
        </div>

        <Button
          onClick={onAdd}
          className="bg-white text-amber-600 hover:bg-amber-50"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Player
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlayersHeader;
