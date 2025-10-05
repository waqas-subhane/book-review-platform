import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FaBookOpen } from 'react-icons/fa'; // Icon import

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-slate-800">
          <FaBookOpen className="text-slate-600" />
          <span>BookReview</span>
        </Link>
        <nav className="flex items-center space-x-6 text-lg">
          <Link to="/" className="text-slate-600 hover:text-slate-900 transition-colors">Home</Link>
          {user ? (
            <>
              <Link to="/add-book" className="text-slate-600 hover:text-slate-900 transition-colors">Add Book</Link>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-semibold">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
              <Link to="/signup" className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-900 transition-colors font-semibold">
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;