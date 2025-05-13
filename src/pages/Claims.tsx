
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getClaimsByUserId, getItemById, Claim } from '@/lib/mockDb';
import { useAuth } from '@/contexts/AuthContext';
import PageContainer from '@/components/layout/PageContainer';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ClaimWithItem extends Claim {
  itemTitle: string;
  itemStatus: 'lost' | 'found';
}

const Claims = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState<ClaimWithItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      const fetchedClaims = getClaimsByUserId(currentUser.id);
      
      // Add item details to each claim
      const claimsWithItems = fetchedClaims.map(claim => {
        const item = getItemById(claim.itemId);
        return {
          ...claim,
          itemTitle: item?.title || 'Unknown Item',
          itemStatus: item?.status || 'lost',
        };
      });
      
      setClaims(claimsWithItems);
      setLoading(false);
    }
  }, [currentUser]);

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
                        to={`/items/${claim.itemId}`} 
                        className="hover:text-custom-purple"
                      >
                        {claim.itemTitle}
                      </Link>
                    </h2>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={claim.itemStatus === 'lost' ? 'bg-red-500' : 'bg-green-500'}>
                        {claim.itemStatus === 'lost' ? 'Lost' : 'Found'}
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
                      Claimed on {format(new Date(claim.createdAt), 'PPP')}
                    </span>
                    
                    <Link 
                      to={`/items/${claim.itemId}`}
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
