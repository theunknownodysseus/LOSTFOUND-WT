
import { useState, useEffect } from 'react';
import { getItems, Item } from '@/lib/mockDb';
import PageContainer from '@/components/layout/PageContainer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ItemCard from '@/components/items/ItemCard';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);

  useEffect(() => {
    // Fetch all items
    const fetchedItems = getItems();
    setAllItems(fetchedItems);
  }, []);

  const handleSearch = () => {
    const filteredItems = allItems.filter((item) => {
      const matchesSearch = !searchTerm ? true : (
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const matchesCategory = !category ? true : item.category === category;
      const matchesStatus = !status ? true : item.status === status;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    setSearchResults(filteredItems);
    setIsSearchPerformed(true);
  };

  const handleClear = () => {
    setSearchTerm('');
    setCategory('');
    setStatus('');
    setSearchResults([]);
    setIsSearchPerformed(false);
  };

  // Get unique categories from items
  const categories = [...new Set(allItems.map(item => item.category))];

  return (
    <PageContainer className="py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Find Lost & Found Items</h1>
          <p className="text-xl text-gray-600">
            Search through all reported items to find what you're looking for
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-3">
              <Input
                placeholder="Search by item name, description or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                  <SelectItem value="found">Found</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                className="flex-1 bg-custom-purple hover:bg-custom-secondaryPurple"
                onClick={handleSearch}
              >
                <SearchIcon size={16} className="mr-2" />
                Search
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleClear}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
        
        {isSearchPerformed && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Search Results ({searchResults.length})
            </h2>
            
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {searchResults.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">No items found matching your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Search;
