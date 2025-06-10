import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const SignUp = () => {
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const [loading, setLoading] = useState(false);


    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
        qualification: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
        qualification: '',
        password: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            name: '',
            email: '',
            phone: '',
            gender: '',
            qualification: '',
            password: ''
        };

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone number must be at least 10 digits';
        }

        if (!formData.gender.trim()) {
            newErrors.gender = 'Please select a gender';
        }


        if (!formData.qualification.trim()) {
            newErrors.qualification = 'Qualification is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true); // Start loader
        try {
            const res = await axios.post('http://localhost:5000/signup', formData);
            const data = res.data;

            if (res.status === 201 || res.status === 200) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success('Account Created successfully!');
                navigate('/dashboard');
            } else {
                alert('Signup failed. Please try again.');
            }
        } catch (error: any) {
            if (error.response?.data?.error) {
                alert(`Error: ${error.response.data.error}`);
            } else {
                alert('Something went wrong. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };


    const inputBaseClass = `w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`;
    const darkInputClass = `bg-gray-900 text-white border-gray-700 placeholder-gray-400`;
    const lightInputClass = `bg-white text-black border-gray-300 placeholder-gray-500`;

    return (
        <>
            <button
                onClick={toggleDarkMode}
                className={`${darkMode ? 'text-white' : ''} mt-4 inline-flex items-center gap-2 px-3 py-1 text-lg transition fixed right-5`}
            >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-primary/5 via-background to-secondary/10 text-gray-900'} flex items-center justify-center p-4 transition-colors duration-300`}>
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-primary rounded-full mb-4">
                            <img src={'/assets/logo.webp'} alt="" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
                    </div>

                    <div className={`border rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <form onSubmit={handleSignUp} className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`${inputBaseClass} pl-10 pr-4 py-3 ${darkMode ? darkInputClass : lightInputClass} ${errors.name ? 'border-destructive focus:ring-destructive' : 'hover:border-primary/50'}`}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`${inputBaseClass} pl-10 pr-4 py-3 ${darkMode ? darkInputClass : lightInputClass} ${errors.email ? 'border-destructive focus:ring-destructive' : 'hover:border-primary/50'}`}
                                        placeholder="Enter your email address"
                                    />
                                </div>
                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`${inputBaseClass} pl-10 pr-4 py-3 ${darkMode ? darkInputClass : lightInputClass} ${errors.phone ? 'border-destructive focus:ring-destructive' : 'hover:border-primary/50'}`}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                            </div>

                            {/* Gender */}
                            <div className=" flex items-center space-x-10">
                                <label className="text-sm font-medium text-foreground">Gender</label>
                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            checked={formData.gender === 'male'}
                                            onChange={handleInputChange}
                                            className="accent-primary"
                                        />
                                        Male
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            checked={formData.gender === 'female'}
                                            onChange={handleInputChange}
                                            className="accent-primary"
                                        />
                                        Female
                                    </label>

                                </div>
                                {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
                            </div>

                            {/* Qualification */}
                            <div className="space-y-2">
                                <label htmlFor="qualification" className="text-sm font-medium text-foreground">Qualification</label>
                                <div className="relative">
                                    <input
                                        id="qualification"
                                        name="qualification"
                                        type="text"
                                        value={formData.qualification}
                                        onChange={handleInputChange}
                                        className={`${inputBaseClass} px-4 py-3 ${darkMode ? darkInputClass : lightInputClass} ${errors.qualification ? 'border-destructive focus:ring-destructive' : 'hover:border-primary/50'}`}
                                        placeholder="Enter your qualification"
                                    />
                                </div>
                                {errors.qualification && <p className="text-sm text-destructive">{errors.qualification}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
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
                                        className={`${inputBaseClass} pl-10 pr-12 py-3 ${darkMode ? darkInputClass : lightInputClass} ${errors.password ? 'border-destructive focus:ring-destructive' : 'hover:border-primary/50'}`}
                                        placeholder="Create a password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full ${darkMode ? 'bg-blue-700' : 'bg-black'} hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex justify-center items-center`}
                            >
                                {loading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                        ></path>
                                    </svg>
                                ) : (
                                    'Create Account'
                                )}
                            </button>

                        </form>

                        {/* Sign In Link */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/signin')}
                                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
