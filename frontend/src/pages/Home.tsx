import { useContext, useEffect, useState } from 'react';
import VideoFeed from '../components/VideoFeed';
import TextToSign from '../components/TextToSign';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { validateToken } from '../api';
import { toast } from 'react-toastify';
import HowItWorks from '../components/Landing page/HowItWorks';
import Features from '../components/Landing page/Features';

const Home = () => {
    const [activeMode, setActiveMode] = useState<'sign-to-text' | 'text-to-sign'>('sign-to-text');
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('Please sign in first.');
            navigate('/signin');
            return;
        }

        validateToken(token)
            .then((res) => {
                console.log('Authenticated:', res.data);
            })
            .catch(() => {
                toast.error('Session expired. Please sign in again.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/signin');
            });
    }, [navigate]);

    return (
        <div
            className={`${darkMode
                ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-700'
                : 'bg-gradient-to-br from-blue-50 to-indigo-50'
                }`}
        >
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Mode Toggle Buttons */}
                <div className="flex justify-center mb-8 mt-20">
                    <div className={`${darkMode ? 'bg-gray-800' : ''} rounded-full p-2 shadow-md`}>
                        <button
                            onClick={() => setActiveMode('sign-to-text')}
                            className={`px-6 py-3 rounded-full transition-all ${activeMode === 'sign-to-text'
                                ? 'bg-blue-500 text-white'
                                : darkMode
                                    ? 'hover:bg-gray-700 text-gray-300'
                                    : 'hover:bg-gray-100 text-gray-700'
                                }`}
                        >
                            Sign to Text
                        </button>
                        <button
                            onClick={() => setActiveMode('text-to-sign')}
                            className={`px-6 py-3 rounded-full transition-all ${activeMode === 'text-to-sign'
                                ? 'bg-blue-500 text-white'
                                : darkMode
                                    ? 'hover:bg-gray-700 text-gray-300'
                                    : 'hover:bg-gray-100 text-gray-700'
                                }`}
                        >
                            Text to Sign
                        </button>
                    </div>
                </div>

                {/* Mode Content */}
                {activeMode === 'sign-to-text' ? (
                    <div className="flex gap-16 mb-20 mx-auto justify-center">
                        <div className="col-span-2">
                            <VideoFeed mode={activeMode} />
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-16 mb-20 mx-auto justify-center">
                        <div className="col-span-2">
                            <TextToSign />
                        </div>
                    </div>
                )}

                {/* Static Sections */}
            </div>
            <HowItWorks />
            <Features />
        </div>
    );
};

export default Home;
