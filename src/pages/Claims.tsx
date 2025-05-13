
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PageContainer from '@/components/layout/PageContainer';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface Claim {
  id: string;
  status: 'approved' | 'rejected' | 'pending';
  message: string;
  created_at: string;
  user_id: string;
  item_id: string;
}

interface Item {
  id: string;
  name: string;
  status: 'lost' | 'found';
}

interface ClaimWithItem extends Claim {
  item: Item;
}

const Claims = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState<ClaimWithItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      navigate('/login');
      return;
    }

    const fetchClaims = async () => {
      try {
        // Fetch claim requests for the current user
        const { data: claimData, error: claimError } = await supabase
          .from('claim_requests')
          .select('*')
          .eq('user_id', currentUser.id);

        if (claimError) {
          throw claimError;
        }

        if (!claimData || claimData.length === 0) {
          setClaims([]);
          setLoading(false);
          return;
        }

        // Fetch item details for each claim
        const itemIds = claimData.map(claim => claim.item_id);
        const { data: itemsData, error: itemsError } = await supabase
          .from('items')
          .select('id, name, status')
          .in('id', itemIds);

        if (itemsError) {
          throw itemsError;
        }

        // Combine claim and item data
        const claimsWithItems = claimData.map(claim => {
          const item = itemsData?.find(item => item.id === claim.item_id) || 
            { id: claim.item_id, name: 'Unknown Item', status: 'lost' as const };
          
          return {
            ...claim,
            item
          };
        });

        setClaims(claimsWithItems);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load claims",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [currentUser, isAuthenticated, navigate, toast]);

  // Redirect if not logged in
  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageContainer className="py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Claims</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg">Loading your claims...</p>
          </div>
        ) : claims.length > 0 ? (
          <div className="space-y-6">
            {claims.map(claim => (
              <Card key={claim.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-medium">
                      <Link 
                        to={`/items/${claim.item_id}`} 
                        className="hover:text-custom-purple"
                      >
                        {claim.item.name}
                      </Link>
                    </h2>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={claim.item.status === 'lost' ? 'bg-red-500' : 'bg-green-500'}>
                        {claim.item.status === 'lost' ? 'Lost' : 'Found'}
                      </Badge>
                      
                      <Badge className={
                        claim.status === 'approved' ? 'bg-green-500' : 
                        claim.status === 'rejected' ? 'bg-red-500' : 
                        'bg-yellow-500'
                      }>
                        {claim.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 font-medium mb-1">Your claim message:</p>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm">{claim.message}</p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-gray-50 px-6 py-3">
                  <div className="flex justify-between w-full text-sm">
                    <span className="text-gray-500">
                      Claimed on {format(new Date(claim.created_at), 'PPP')}
                    </span>
                    
                    <Link 
                      to={`/items/${claim.item_id}`}
                      className="text-custom-purple hover:underline font-medium"
                    >
                      View Item
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-2xl font-medium mb-2">No claims submitted</h2>
            <p className="text-gray-600 mb-6">
              You haven't submitted any claims for lost or found items yet.
            </p>
            <Link 
              to="/items"
              className="text-custom-purple hover:underline font-medium"
            >
              Browse items
            </Link>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Claims;
