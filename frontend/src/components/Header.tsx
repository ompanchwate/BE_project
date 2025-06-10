import React, { useContext, useEffect, useRef, useState } from 'react';
import { Sun, Moon, User, LogOut, LayoutDashboard } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
    }
  }, []);

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

  const logoutUser = () => {
    localStorage.clear();
    navigate('/signin');
  };

  return (
    <header className={`sticky ${darkMode ? 'bg-gray-500 text-white' : 'bg-white'} shadow-lg `}>
      <div className="sticky container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src={'/assets/logo.webp'}  alt="Logo" className="h-10 w-10" />
            <a href="/dashboard" className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>HandyTalk</a>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4 relative" ref={dropdownRef}>

            {/* Dashboard Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </button>

            {/* Username Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600 border-2 rounded-[50px] bg-blue-50 border-blue-500'}`}
              >
                <User className="h-5 w-5" />
                <span>{userName || 'User'}</span>
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
                    onClick={logoutUser}
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
