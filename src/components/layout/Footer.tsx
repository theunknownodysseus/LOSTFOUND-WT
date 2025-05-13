
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-custom-purple mb-2">LostFound</h3>
            <p className="text-sm text-gray-600">
              Helping reunite people with their lost belongings.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">QUICK LINKS</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-custom-purple">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/items" className="text-sm text-gray-600 hover:text-custom-purple">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-sm text-gray-600 hover:text-custom-purple">
                  Report Item
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-sm text-gray-600 hover:text-custom-purple">
                  Search
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">HELP</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-600 hover:text-custom-purple cursor-not-allowed">
                  FAQ
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-600 hover:text-custom-purple cursor-not-allowed">
                  Contact Us
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-600 hover:text-custom-purple cursor-not-allowed">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-600 hover:text-custom-purple cursor-not-allowed">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-center text-gray-500">
            &copy; {new Date().getFullYear()} LostFound. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
