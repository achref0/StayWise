import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, User } from 'lucide-react';

function Header() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            StayWise
          </Link>
          <nav>
            <ul className="flex items-center space-x-8">
              <li>
                <Link to="/" className={`flex items-center space-x-2 ${isActive('/')}`}>
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/search" className={`flex items-center space-x-2 ${isActive('/search')}`}>
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </Link>
              </li>
              <li>
                <Link to="/account" className={`flex items-center space-x-2 ${isActive('/account')}`}>
                  <User className="w-5 h-5" />
                  <span>Account</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;

