import React, { useContext, useEffect, useRef, useState } from 'react';
import { Sun, Moon, User, LogOut, LayoutDashboard } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';

const Header = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`fixed w-full z-50 ${darkMode ? 'bg-gray-500 text-white' : 'bg-white'} shadow-lg`}>
      <div className=" container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className='flex space-x-28'>
            <div className="flex items-center space-x-2">
              <img src={'/assets/logo.png'} alt="Logo" className="h-10 w-10" />
              <a href="/dashboard" className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                HandyTalk
              </a>
            </div>

            <div className='flex space-x-8'>
              <button
                onClick={() => navigate('/dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
              >
                <span>How It Works</span>
              </button>

              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
              >
                <span>Features</span>
              </button>
            </div>
          </div>


          <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center space-x-2 px-4 py-2  border-2 rounded-full  border-blue-500 ${darkMode ? 'hover:bg-gray-700 text-gray-300 bg-gray-800 ' : 'hover:bg-gray-100 text-gray-600 bg-blue-50'}`}
              >
                <User className="h-5 w-5" />
                <span>{user?.name || 'User'}</span>
              </button>

              {dropdownOpen && (
                <div className={`absolute right-0 mt-2 w-40 rounded-lg shadow-md z-50 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}>
                  <button
                    className={`w-full text-left px-4 py-2 hover:bg-gray-200 ${darkMode ? 'hover:bg-gray-600' : ''}`}
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/profile');
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 hover:bg-gray-200 ${darkMode ? 'hover:bg-gray-600' : ''}`}
                    onClick={() => {
                      setDropdownOpen(false);
                      logout(); // ✅ Use context logout
                      navigate('/');
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
