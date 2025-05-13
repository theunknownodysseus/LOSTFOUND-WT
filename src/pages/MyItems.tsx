
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getItems, Item } from '@/lib/mockDb';
import { useAuth } from '@/contexts/AuthContext';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import ItemCard from '@/components/items/ItemCard';

const MyItems = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      const fetchedItems = getItems({ userId: currentUser.id });
      setItems(fetchedItems);
      setLoading(false);
    }
  }, [currentUser]);

  return (
    <PageContainer className="py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Items</h1>
          <Button className="bg-custom-purple hover:bg-custom-secondaryPurple" asChild>
            <Link to="/report">
              <FilePlus size={16} className="mr-2" />
              Report Item
            </Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg">Loading your items...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-medium mb-2">No items reported yet</h2>
            <p className="text-gray-600 mb-6">You haven't reported any lost or found items.</p>
            <Button className="bg-custom-purple hover:bg-custom-secondaryPurple" asChild>
              <Link to="/report">
                <FilePlus size={16} className="mr-2" />
                Report an Item
              </Link>
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default MyItems;
