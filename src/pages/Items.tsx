
import { useEffect, useState } from 'react';
import { getItems, Item } from '@/lib/mockDb';
import PageContainer from '@/components/layout/PageContainer';
import ItemsList from '@/components/items/ItemsList';

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchedItems = getItems();
    setItems(fetchedItems);
    setLoading(false);
  }, []);

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
