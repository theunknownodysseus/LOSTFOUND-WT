
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { LogIn, LogOut, Menu, Search, FilePlus, Mail } from 'lucide-react';

export const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-custom-purple">LostFound</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-custom-purple">
              Home
            </Link>
            <Link to="/items" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-custom-purple">
              Items
            </Link>
            <Link to="/report" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-custom-purple">
              <FilePlus size={18} className="mr-1" /> Report
            </Link>
            <Link to="/search" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-custom-purple">
              <Search size={18} className="mr-1" /> Search
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-custom-purple text-white">
                        {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to="/my-items">My Items</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to="/claims">
                      <Mail size={16} className="mr-2" /> Claims
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-red-500" onClick={logout}>
                    <LogOut size={16} className="mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">
                    <LogIn size={16} className="mr-2" /> Login
                  </Link>
                </Button>
                <Button className="bg-custom-purple hover:bg-custom-secondaryPurple" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-custom-purple"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white pb-3 px-4 sm:px-6 lg:px-8 space-y-1">
          <Link 
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-custom-purple"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/items"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-custom-purple"
            onClick={() => setMobileMenuOpen(false)}
          >
            Items
          </Link>
          <Link 
            to="/report"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-custom-purple"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FilePlus size={18} className="mr-2" /> Report
          </Link>
          <Link 
            to="/search"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-custom-purple"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Search size={18} className="mr-2" /> Search
          </Link>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-3">
                  <div className="flex-shrink-0">
                    <Avatar>
                      <AvatarFallback className="bg-custom-purple text-white">
                        {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{currentUser?.name}</div>
                    <div className="text-sm font-medium text-gray-500">{currentUser?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-custom-purple"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-items"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-custom-purple"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Items
                  </Link>
                  <Link
                    to="/claims"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-custom-purple"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Mail size={16} className="mr-2" /> Claims
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-custom-purple"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn size={16} className="mr-2" /> Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-custom-purple"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
