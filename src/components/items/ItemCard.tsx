
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { Item } from '@/lib/mockDb';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ItemCardProps {
  item: Item;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const timeAgo = formatDistance(
    new Date(item.createdAt),
    new Date(),
    { addSuffix: true }
  );

  return (
    <Link to={`/items/${item.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={item.imageUrl || '/placeholder.svg'} 
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg truncate">{item.title}</h3>
            <Badge className={item.status === 'lost' ? 'bg-red-500' : 'bg-green-500'}>
              {item.status === 'lost' ? 'Lost' : 'Found'}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
          <p className="text-xs text-gray-500 font-medium">
            {item.location}
          </p>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0 flex justify-between text-xs text-gray-500">
          <span>{item.category}</span>
          <span>{timeAgo}</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ItemCard;
