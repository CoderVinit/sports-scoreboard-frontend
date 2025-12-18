import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MatchesHeader = ({ total, onCreate }) => {
  return (
    <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl mb-6">
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Manage Matches</h2>
          <p className="text-blue-100">{total} matches total</p>
        </div>
        <Button
          onClick={onCreate}
          className="bg-white text-blue-600 h-12 px-6 font-semibold shadow-lg cursor-pointer"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Match
        </Button>
      </CardContent>
    </Card>
  );
};

export default MatchesHeader;
