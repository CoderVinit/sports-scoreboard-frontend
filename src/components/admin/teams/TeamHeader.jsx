import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TeamsHeader = ({ count, onAdd }) => {
  return (
    <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-none shadow-2xl mb-6">
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">Manage Teams</h2>
          <p className="text-green-100">
            {count} {count === 1 ? 'team' : 'teams'} registered
          </p>
        </div>

        <Button
          onClick={onAdd}
          className="bg-white text-green-600 hover:bg-green-50 font-semibold h-12 px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Team
        </Button>
      </CardContent>
    </Card>
  );
};

export default TeamsHeader;
