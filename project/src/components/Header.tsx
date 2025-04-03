import React, { useContext } from 'react';
import { MessageSquare, User, Moon, Sun } from 'lucide-react';
import { ThemeContext } from '../App';

const Header = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <header className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-sm`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>MedSign Connect</h1>
          </div>
          
          <div className="flex items-center space-x-4">
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
            <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <User className="h-5 w-5" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;