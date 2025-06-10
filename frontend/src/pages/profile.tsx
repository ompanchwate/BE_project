import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, GraduationCap, LogOut, ArrowLeft, Edit, Settings, X } from 'lucide-react';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeContext';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{
        isSignedIn: boolean;
        username?: string;
        name?: string;
        email?: string;
        phone?: string;
        qualification?: string;
        gender?: string;
        created_at?: string;
    } | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        phone: '',
        qualification: '',
        gender: '',
    });

    const { darkMode } = useContext(ThemeContext);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setEditFormData({
                name: parsedUser.name || '',
                email: parsedUser.email || '',
                phone: parsedUser.phone || '',
                qualification: parsedUser.qualification || '',
                gender: parsedUser.gender || '',
            });
        }
    }, [navigate]);

    const handleSignOut = () => {
        localStorage.removeItem('user');
        navigate('/signin');
    };

    const handleEditProfile = () => {
        setIsEditDialogOpen(true);
    };

    const handleFormChange = (field: string, value: string) => {
        setEditFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveChanges = async () => {
        if (user) {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch('http://localhost:5000/update-profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(editFormData)
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setUser(data.user);
                    setIsEditDialogOpen(false);
                } else {
                    console.error(data.error);
                    alert('Failed to update profile: ' + data.error);
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('An error occurred while updating the profile.');
            }
        }
    };



    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={` ${darkMode ? ' bg-slate-700' : 'text-black'} min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10`}>
            <Header />

            {/* Main Content */}
            <main className={` ${darkMode ? 'text-white' : 'text-black'} max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
                {/* Page Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-6">
                        My Profile
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Manage your account information and personal details
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            {/* Enhanced Profile Header */}
                            <div className="relative bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 px-8 py-12 text-center">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
                                <div className="relative">
                                    <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-primary to-secondary rounded-full mb-6 shadow-lg">
                                        <img src={`${user.gender === "Male" ? '/assets/male_doctor.jpg' : '/assets/female_doctor.jpg'}`} className='rounded-full' alt="" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-foreground mb-2">
                                        {user.name || user.username || 'User'}
                                    </h2>
                                    <p className="text-muted-foreground text-lg">Account Profile</p>
                                    <button
                                        onClick={handleEditProfile}
                                        className="mt-4 inline-flex items-center px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors duration-200"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </button>
                                </div>
                            </div>

                            {/* ... keep existing code (Enhanced Profile Details section) */}
                            <div className="p-8">
                                <h3 className="text-xl font-semibold text-foreground mb-8 flex items-center">
                                    <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></div>
                                    Account Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Username */}
                                    {user.username && (
                                        <div className="group p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                                    <User className="h-6 w-6 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-sm font-medium text-primary/80 uppercase tracking-wide">Username</label>
                                                    <p className="text-foreground font-semibold text-lg">{user.username}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Full Name */}
                                    {user.name && (
                                        <div className="group p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-gray-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center justify-center w-12 h-12 bg-secondary/30 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                                    <User className="h-6 w-6 text-secondary-foreground" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-sm font-medium text-secondary-foreground/80 uppercase tracking-wide text-gray-500">Full Name</label>
                                                    <p className="text-foreground font-semibold text-lg">{user.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Email */}
                                    {user.email && (
                                        <div className="group p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center justify-center w-12 h-12 bg-blue-200 dark:bg-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                                    <Mail className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className={` ${darkMode ? 'text-blue-600' : 'text-gray-500'} text-sm font-medium  uppercase tracking-wide`}>Email Address</label>
                                                    <p className="text-foreground font-semibold text-lg">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Phone */}
                                    {user.phone && (
                                        <div className="group p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center justify-center w-12 h-12 bg-green-200 dark:bg-green-700 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                                    <Phone className="h-6 w-6 text-green-700 dark:text-green-300" />
                                                </div>
                                                <div className="flex-1">
                                                    <label
                                                        className={` ${darkMode ? 'text-green-700' : 'text-gray-500'} text-sm font-medium  uppercase tracking-wide`}
                                                    >Phone Number</label>
                                                    <p className="text-foreground font-semibold text-lg">{user.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Gender */}
                                    {user.gender && (
                                        <div className="group p-4 bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl border border-pink-200 dark:border-pink-700 hover:border-pink-300 dark:hover:border-pink-600 transition-all duration-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center justify-center w-12 h-12 bg-pink-200 dark:bg-pink-700 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                                    <User className="h-6 w-6 text-pink-700 dark:text-pink-300" />
                                                </div>
                                                <div className="flex-1">
                                                    <label
                                                        className={` ${darkMode ? 'text-pink-700' : 'text-gray-500'} text-sm font-medium  uppercase tracking-wide`}
                                                    >Gender</label>
                                                    <p className="text-foreground font-semibold text-lg capitalize">
                                                        {user.gender}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Qualification */}
                                    {user.qualification && (
                                        <div className="group p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 md:col-span-2">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center justify-center w-12 h-12 bg-purple-200 dark:bg-purple-700 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                                    <GraduationCap className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                                                </div>
                                                <div className="flex-1">
                                                    <label
                                                        className={` ${darkMode ? 'text-purple-700' : 'text-gray-500'} text-sm font-medium  uppercase tracking-wide`}>Qualification</label>
                                                    <p className="text-foreground font-semibold text-lg capitalize">
                                                        {user.qualification.replace('-', ' ')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Quick Actions Card */}
                        <div className="bg-card border border-border rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                                <div className="w-1 h-5 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></div>
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                                >
                                    Go to Dashboard
                                </button>
                                {/* <button
                                    onClick={handleEditProfile}
                                    className="w-full flex items-center justify-center px-4 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium rounded-lg transition-all duration-200 hover:scale-105"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </button> */}
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-border text-foreground hover:bg-destructive hover:text-destructive-foreground font-medium rounded-lg transition-all duration-200 hover:scale-105"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-card border border-border rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                                <div className="w-1 h-5 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></div>
                                Account Stats
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Member Since</span>
                                    <span className="font-semibold">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        }).replace(/(\d{1,2})/, (d) => {
                                            const day = parseInt(d);
                                            const suffix = (day) => {
                                                if (day > 3 && day < 21) return 'th';
                                                switch (day % 10) {
                                                    case 1: return 'st';
                                                    case 2: return 'nd';
                                                    case 3: return 'rd';
                                                    default: return 'th';
                                                }
                                            };
                                            return `${day}${suffix(day)}`;
                                        }) : 'Dec 2024'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Last Login</span>
                                    <span className="font-semibold">Today</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Modal */}
                {isEditDialogOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Edit className="h-5 w-5" />
                                    Edit Profile
                                </h2>
                                <button
                                    onClick={() => setIsEditDialogOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                    Make changes to your profile here. Click save when you're done.
                                </p>

                                <div className="space-y-4">
                                    {/* Name Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editFormData.name}
                                            onChange={(e) => handleFormChange('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>


                                    {/* Phone Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            value={editFormData.phone}
                                            onChange={(e) => handleFormChange('phone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>

                                    {/* Qualification Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Qualification
                                        </label>
                                        <input
                                            type="text"
                                            value={editFormData.qualification}
                                            onChange={(e) => handleFormChange('qualification', e.target.value)}
                                            placeholder="Enter qualification"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>


                                    {/* Gender Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Gender
                                        </label>
                                        <select
                                            value={editFormData.gender}
                                            onChange={(e) => handleFormChange('gender', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => setIsEditDialogOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveChanges}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div >
    );
};

export default Profile;