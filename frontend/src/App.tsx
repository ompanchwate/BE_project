import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import { ThemeProvider } from './context/ThemeContext';
import Profile from './pages/profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './context/userContext';
import Index from './pages';
import HowItWorks from './components/Landing page/HowItWorks';
import Features from './components/Landing page/Features';
import { validateToken } from './api'; // your backend token validation function

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      validateToken(token)
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        })
        .finally(() => setIsAuthenticating(false));
    } else {
      setIsAuthenticating(false);
    }
  }, []);

  // Show nothing while authentication check is in progress
  if (isAuthenticating) return null;

  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <Routes>
            {/* Redirect '/' to dashboard if authenticated */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Index />} />

            {/* Hide SignIn & SignUp if already authenticated */}
            {!isAuthenticated && (
              <>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
              </>
            )}

            {/* Protected pages */}
            <Route path="/dashboard" element={<Home />} />
            <Route path="/profile" element={<Profile />} />

            {/* Public sections that can still be accessed directly */}
            <Route path="/howitworks" element={<HowItWorks />} />
            <Route path="/features" element={<Features />} />

            {/* Catch-all route (optional) */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
