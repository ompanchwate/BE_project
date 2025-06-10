import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Sun, Moon, Loader2 } from 'lucide-react'; // Import Loader2 for spinner
import { ThemeContext } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const SignIn = () => {
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    // New state for loading indicator
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            email: '',
            password: ''
        };

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return !newErrors.email && !newErrors.password;
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            setIsLoading(true); // Set loading to true when sign-in process starts
            try {
                const res = await fetch('http://localhost:5000/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    toast.success('Sign in successful!');
                    navigate('/dashboard');
                } else {
                    // Replaced alert with toast.error as per previous instructions
                    toast.error(data.error || 'Sign in failed');
                }
            } catch (err) {
                console.error('❌ Error during sign in:', err);
                // Replaced alert with toast.error as per previous instructions
                toast.error('Server error. Please try again later.');
            } finally {
                setIsLoading(false); // Set loading to false when sign-in process finishes
            }
        }
    };

    return (
        <>
            {/* Theme toggle */}
            <button
                onClick={toggleDarkMode}
                className={`${darkMode ? 'text-white' : ''} mt-4 inline-flex items-center gap-2 px-3 py-1 text-lg transition absolute right-5`}
            >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-primary/5 via-background to-secondary/10 text-gray-900'} flex items-center justify-center p-4 transition-colors duration-300`}>
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-24 h-24 ${darkMode ? 'bg-gray-800' : 'bg-primary'} rounded-full mb-4`}>
                            <img src={'/assets/logo.webp'} alt="" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Welcome Back to HandyTalk</h1>
                        <p className="text-sm opacity-70">Sign in to your account to continue</p>
                    </div>

                    {/* Form */}
                    <div className={`border rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-border'}`}>
                        <form onSubmit={handleSignIn} className="space-y-6">
                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg bg-transparent border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${errors.email
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-input hover:border-primary/50'
                                            }`}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-12 py-3 rounded-lg bg-transparent border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${errors.password
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-input hover:border-primary/50'
                                            }`}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            {/* Forgot password */}
                            <div className="flex items-center justify-end">
                                <button
                                    type="button"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {/* Sign In Button */}
                            <button
                                type="submit"
                                className={` ${darkMode ? 'bg-blue-700' : 'bg-black'} w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center space-x-2`}
                                disabled={isLoading} // Disable button while loading
                            >
                                {isLoading && <Loader2 className="animate-spin h-5 w-5 mr-2" />} {/* Spinner */}
                                {isLoading ? 'Signing In...' : 'Sign In'} {/* Button text changes */}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="text-center mt-6">
                            <p className="text-sm">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/signup')}
                                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignIn;
