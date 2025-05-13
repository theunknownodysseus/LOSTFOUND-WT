
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const itemSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  description: z.string().min(10, { message: 'Please provide a detailed description' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  status: z.enum(['lost', 'found'], { 
    required_error: 'Please specify if the item is lost or found' 
  }),
  date: z.string().min(1, { message: 'Please select a date' }),
  location: z.string().min(3, { message: 'Please provide a location' }),
  image: z.any().optional(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

const categories = [
  'Electronics', 'Keys', 'Wallet', 'ID/Card', 'Jewelry', 
  'Clothing', 'Bag/Purse', 'Books', 'Personal Items', 'Other'
];

const ReportItem = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      status: 'lost',
      date: new Date().toISOString().split('T')[0],
      location: '',
    },
  });

  const onSubmit = async (data: ItemFormValues) => {
    if (!isAuthenticated || !currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to report an item.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting item:", data);
      console.log("Current user:", currentUser);
      
      // Add the item to Supabase
      const { error, data: newItem } = await supabase
        .from('items')
        .insert({
          user_id: currentUser.id,
          name: data.title,
          description: data.description,
          category: data.category,
          status: data.status,
          date: data.date,
          location: data.location,
          image_url: '/placeholder.svg', // In a real app, handle image upload to Storage
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      console.log("Item submitted successfully:", newItem);
      
      toast({
        title: "Item Reported Successfully",
        description: "Your item has been added to our database.",
      });
      
      navigate(`/items/${newItem.id}`);
    } catch (error: any) {
      console.error("Error reporting item:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to report item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <PageContainer className="py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Report an Item</h1>
        <p className="text-gray-600 mb-8">
          Fill out the form below with as much detail as possible to help find your item or locate its owner.
        </p>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Status</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="lost" id="lost" />
                          <Label htmlFor="lost">I lost this item</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="found" id="found" />
                          <Label htmlFor="found">I found this item</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name/Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Black Wallet, iPhone 13, Car Keys" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a detailed description of the item..." 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.watch('status') === 'lost' ? 'Date Lost' : 'Date Found'}
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Central Park, Coffee Shop on Main St., Bus #42" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/*"
                        disabled
                        className="cursor-not-allowed"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                          }
                        }}
                      />
                    </FormControl>
                    <p className="text-sm text-gray-500">
                      Image upload will be available in a future update
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-custom-purple hover:bg-custom-secondaryPurple"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </PageContainer>
  );
};

export default ReportItem;
