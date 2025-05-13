
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { getItemById, addClaim, getClaimsByItemId, Item, Claim } from '@/lib/mockDb';
import { useAuth } from '@/contexts/AuthContext';
import PageContainer from '@/components/layout/PageContainer';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Check, Mail } from 'lucide-react';

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [item, setItem] = useState<Item | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimMessage, setClaimMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    const fetchedItem = getItemById(id);
    
    if (fetchedItem) {
      setItem(fetchedItem);
      setClaims(getClaimsByItemId(id));
    } else {
      toast({
        title: "Item Not Found",
        description: "The requested item could not be found.",
        variant: "destructive",
      });
      navigate('/items');
    }
    
    setLoading(false);
  }, [id, navigate, toast]);

  const handleClaimSubmit = () => {
    if (!currentUser || !item) return;
    
    setIsSubmitting(true);
    
    try {
      addClaim({
        itemId: item.id,
        userId: currentUser.id,
        message: claimMessage,
      });
      
      toast({
        title: "Claim Submitted",
        description: "Your claim has been submitted successfully.",
      });
      
      setClaimMessage('');
      setIsDialogOpen(false);
      // Refresh claims
      setClaims(getClaimsByItemId(item.id));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit claim. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if the current user has already submitted a claim for this item
  const hasUserClaimed = currentUser && claims.some(claim => claim.userId === currentUser.id);
  
  // Check if the current user is the owner of the item
  const isOwner = currentUser && item && currentUser.id === item.userId;

  if (loading) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-lg">Loading item details...</p>
        </div>
      </PageContainer>
    );
  }

  if (!item) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-lg text-red-500">Item not found</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto my-12 px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={item.imageUrl || '/placeholder.svg'} 
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold">{item.title}</h1>
                <Badge className={item.status === 'lost' ? 'bg-red-500' : 'bg-green-500'}>
                  {item.status === 'lost' ? 'Lost' : 'Found'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Category</h3>
                    <p className="text-gray-700">{item.category}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">
                      {item.status === 'lost' ? 'Date Lost' : 'Date Found'}
                    </h3>
                    <p className="text-gray-700">{format(new Date(item.date), 'PPP')}</p>
                  </div>
                  
                  <div className="col-span-2">
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Location</h3>
                    <p className="text-gray-700">{item.location}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  {isAuthenticated ? (
                    <>
                      {isOwner ? (
                        <div className="bg-custom-lightPurple p-4 rounded-md">
                          <p className="text-sm">
                            You posted this item. Check the claims below.
                          </p>
                        </div>
                      ) : hasUserClaimed ? (
                        <div className="bg-green-50 p-4 rounded-md">
                          <div className="flex items-center text-green-700">
                            <Check size={18} className="mr-2" />
                            <p className="text-sm font-medium">You have submitted a claim for this item</p>
                          </div>
                        </div>
                      ) : (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-custom-purple hover:bg-custom-secondaryPurple">
                              <Mail size={16} className="mr-2" /> 
                              {item.status === 'lost' ? 'I Found This Item' : 'This Is My Item'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Submit a Claim</DialogTitle>
                              <DialogDescription>
                                {item.status === 'lost' ? 
                                  'Let the owner know you found their item.' : 
                                  'If this is your lost item, please provide details to verify ownership.'}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <Textarea 
                                placeholder={item.status === 'lost' ? 
                                  'Describe how/where you found this item and any additional details...' : 
                                  'Please provide details that prove this item belongs to you...'}
                                className="min-h-32"
                                value={claimMessage}
                                onChange={(e) => setClaimMessage(e.target.value)}
                              />
                            </div>
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button 
                                type="submit" 
                                className="bg-custom-purple hover:bg-custom-secondaryPurple"
                                disabled={!claimMessage.trim() || isSubmitting}
                                onClick={handleClaimSubmit}
                              >
                                {isSubmitting ? 'Submitting...' : 'Submit Claim'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </>
                  ) : (
                    <Button className="w-full" variant="outline" onClick={() => navigate('/login')}>
                      Log In to Submit a Claim
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Claims section - only visible to the owner */}
          {isOwner && (
            <div className="border-t border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Claims ({claims.length})</h2>
              
              {claims.length === 0 ? (
                <p className="text-gray-500">No claims have been submitted yet.</p>
              ) : (
                <div className="space-y-4">
                  {claims.map((claim) => (
                    <Card key={claim.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-semibold">
                              User ID: {claim.userId}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(claim.createdAt), 'PPP')}
                            </p>
                          </div>
                          <Badge className={
                            claim.status === 'approved' ? 'bg-green-500' : 
                            claim.status === 'rejected' ? 'bg-red-500' : 
                            'bg-yellow-500'
                          }>
                            {claim.status}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm">{claim.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default ItemDetail;
