
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PageContainer from '@/components/layout/PageContainer';
import ItemsList from '@/components/items/ItemsList';
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

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        const formattedItems = data.map(item => ({
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
        }));
        
        setItems(formattedItems);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load items",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [toast]);

  return (
    <PageContainer className="py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Lost & Found Items</h1>
        <p className="text-gray-600 mb-8">Browse all reported items</p>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg">Loading items...</p>
          </div>
        ) : (
          <ItemsList items={items} />
        )}
      </div>
    </PageContainer>
  );
};

export default Items;
