
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import ItemCard from '@/components/items/ItemCard';
import { useToast } from '@/components/ui/use-toast';

interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'lost' | 'found';
  date: string;
  location: string;
  image_url?: string;
  created_at: string;
  user_id: string;
}

const MyItems = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchItems = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('user_id', currentUser.id);
          
          if (error) {
            throw error;
          }
          
          setItems(data || []);
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Failed to load items",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchItems();
  }, [currentUser, isAuthenticated, navigate, toast]);

  // Redirect if not logged in
  if (!isAuthenticated) {
    return null;
  }

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
              <ItemCard key={item.id} item={{
                id: item.id,
                title: item.name,
                description: item.description,
                category: item.category,
                status: item.status,
                date: item.date,
                location: item.location,
                imageUrl: item.image_url || '/placeholder.svg',
                createdAt: item.created_at,
                userId: item.user_id
              }} />
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
