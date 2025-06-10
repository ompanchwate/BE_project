import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import { ThemeProvider } from './context/ThemeContext';
import Profile from './pages/profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // <--- IMPORTANT: Added the CSS import for toastify

function App() {
  // isSignedIn state is initialized to false.
  // This state can be used to control protected routes based on user authentication status.
  const [isSignedIn, setIsSignedIn] = useState(false);

  // useEffect hook to check user's sign-in status from localStorage on component mount.
  // In a real application, this would typically involve validating a token from localStorage
  // or checking an authentication context.
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.isSignedIn) {
      setIsSignedIn(true);
    }
    // Note: If you want to use this `isSignedIn` state for route protection,
    // you would typically create a ProtectedRoute component or conditionally render routes.
    // For now, it just sets the state.
  }, []);

  return (
    // ThemeProvider wraps the entire application to provide theme context.
    <ThemeProvider>
      {/* Router enables client-side routing. */}
      <Router>
        {/* Routes component defines the application's routes. */}
        <Routes>
          {/* Default route redirects to the sign-in page. */}
          <Route path="/" element={<Navigate to="/signin" />} />
          {/* Route for the Sign In page. */}
          <Route path="/signin" element={<SignIn />} />
          {/* Route for the Sign Up page. */}
          <Route path="/signup" element={<SignUp />} />
          {/* Route for the Dashboard (Home) page. */}
          <Route path="/dashboard" element={<Home />} />
          {/* Route for the Profile page. */}
          <Route path="/profile" element={<Profile />} />
        </Routes>

        {/* ToastContainer is placed outside the Routes.
            This ensures that the ToastContainer is always rendered and available
            to display toast notifications, regardless of the current route.
            It acts as a portal for all toasts across the application. */}
        <ToastContainer
          position="top-right" // Position of the toast notifications.
          autoClose={5000}      // Toasts will automatically close after 5000ms (5 seconds).
          hideProgressBar={false} // Show a progress bar indicating auto-close time.
          newestOnTop={false}   // Newer toasts will appear below older ones.
          closeOnClick          // Close toast when clicked.
          rtl={false}           // Disable Right-To-Left support.
          pauseOnFocusLoss      // Pause autoClose timer when window loses focus.
          draggable             // Allow dragging toasts to dismiss them.
          pauseOnHover          // Pause autoClose timer when mouse hovers over toast.
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
