import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInfoCircle, FaSignInAlt } from 'react-icons/fa';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    // You might want to decode the token to get the user role
    // or fetch it from an API
    setUserRole(localStorage.getItem('userRole'));
  }, [location]);

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">Tech Vogue</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              Home
            </NavLink>

            {isLoggedIn ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `text-sm font-medium transition ${
                      isActive ? 'text-brand-600' : 'text-gray-500 hover:text-gray-700'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                
                <NavLink
                  to="/pitch-events"
                  className={({ isActive }) =>
                    `text-sm font-medium transition ${
                      isActive ? 'text-brand-600' : 'text-gray-500 hover:text-gray-700'
                    }`
                  }
                >
                  Pitch Events
                </NavLink>

                <NavLink
                  to="/marketplace"
                  className={({ isActive }) =>
                    `text-sm font-medium transition ${
                      isActive ? 'text-brand-600' : 'text-gray-500 hover:text-gray-700'
                    }`
                  }
                >
                  Marketplace
                </NavLink>

                <div className="relative group">
                  <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                    <img
                      src="https://ui-avatars.com/api/?background=6366f1&color=fff"
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  </button>
                  
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      to={`/${userRole?.toLowerCase()}-profile`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('userRole');
                        window.location.href = '/';
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/auth?mode=login"
                  className={({ isActive }) =>
                    `text-sm font-medium transition ${
                      isActive ? 'text-brand-600' : 'text-gray-500 hover:text-gray-700'
                    }`
                  }
                >
                  Sign In
                </NavLink>
                <Link
                  to="/auth?mode=register"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700"
                >
                  Get Started
                </Link>
              </>
            )}
            <div className="hidden md:flex space-x-4">
              <NavItem to="/about" icon={<FaInfoCircle />}>About</NavItem>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500">
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, children, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `inline-flex items-center gap-1.5 rounded-md px-2 py-1 ${isActive ? 'text-brand-700 bg-brand-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
    >
      {icon && <span className="text-brand-700">{icon}</span>}
      {children}
    </NavLink>
  )
}

