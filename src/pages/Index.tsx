
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/PageContainer';
import { Search, FilePlus } from 'lucide-react';

const Index = () => {
  return (
    <PageContainer>
      {/* Hero Section */}
      <div className="bg-custom-lightPurple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Reunite with your lost belongings
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Lost something important? Found an item and want to return it?
                Our platform helps connect lost items with their rightful owners.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-custom-purple hover:bg-custom-secondaryPurple text-lg py-6 px-8"
                  asChild
                >
                  <Link to="/report">
                    <FilePlus size={20} className="mr-2" />
                    Report Item
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  className="text-lg py-6 px-8 border-2"
                  asChild
                >
                  <Link to="/search">
                    <Search size={20} className="mr-2" />
                    Search Items
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/placeholder.svg" 
                alt="Lost and Found" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to report and find lost items
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-custom-purple text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Report an Item</h3>
              <p className="text-gray-600">
                Whether you've lost or found something, create a detailed report
                with description, location, and photo if available.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-custom-purple text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect with Others</h3>
              <p className="text-gray-600">
                Our system helps match lost items with found reports, and allows
                direct communication between users.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-custom-purple text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Reunited</h3>
              <p className="text-gray-600">
                Arrange safe meetups to retrieve your belongings, and mark the
                item as claimed once it's back with its owner.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-custom-purple rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-12 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Join our community today!
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Create an account to report lost items, submit claims, and help others
                reunite with their belongings.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="text-custom-purple bg-white hover:bg-gray-100"
                asChild
              >
                <Link to="/register">
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Index;
