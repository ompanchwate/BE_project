import React, { useContext, useState } from 'react';
import { ThemeContext } from '../App';
import { Heading1 } from 'lucide-react';

export const TextToSign = () => {
    const { darkMode } = useContext(ThemeContext);
    const [timeOfDay, setTimeOfDay] = useState({
        morning: false,
        afternoon: false,
        night: false,
    });

    const [pillType, setPillType] = useState('');
    const [time, setTime] = useState([])
    const [pill, setPill] = useState()

    const handleTimeChange = (time) => {
        setTimeOfDay((prev) => ({
            ...prev,
            [time]: !prev[time],
        }));
    };

    const handlePillChange = (type) => {
        setPillType((prev) => (prev === type ? '' : type));
    };

    const handleConvert = () => {
        const selectedTimes = Object.entries(timeOfDay)
            .filter(([_, isSelected]) => isSelected)
            .map(([time]) => time);

        setTime(selectedTimes)
        setPill(pillType)

        console.log('Selected Times of Day:', selectedTimes);
        console.log('Selected Pill Type:', pillType || 'None');
    };

    return (
        <div className="flex gap-16">
            {/* Video section */}
            <div className="w-[640px] h-[500px] relative bg-gray-300 rounded-lg overflow-hidden">
                <video autoPlay playsInline className="w-full h-full object-cover" />
                <canvas style={{ display: 'none' }} />
            </div>

            {/* Form section */}
            <div
                className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    } rounded-lg shadow-lg p-6 h-[500px] w-[500px]`}
            >
                <form className="flex flex-col gap-6">
                    {/* Time of Day */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Time of Day</h2>
                        <div className="flex gap-4">
                            {['morning', 'afternoon', 'night'].map((time) => (
                                <button
                                    key={time}
                                    type="button"
                                    onClick={() => handleTimeChange(time)}
                                    className={`px-4 py-2 rounded-full border ${timeOfDay[time]
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-transparent text-gray-600 border-gray-400'
                                        } transition duration-200`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pill Type */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Pill Type</h2>
                        <div className="flex gap-4">
                            {['full', 'half'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handlePillChange(type)}
                                    className={`px-4 py-2 rounded-full border ${pillType === type
                                        ? 'bg-green-600 text-white border-green-600'
                                        : 'bg-transparent text-gray-600 border-gray-400'
                                        } transition duration-200`}
                                >
                                    {type} pill
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Convert Button */}
                    <button
                        type="button"
                        className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        onClick={handleConvert}
                    >
                        Convert
                    </button>

                    {pill && time.length > 0 && (
                        <p>
                            Take <strong>{pill}</strong> pill in{' '}
                            <strong>{time.join(', ')}</strong>.
                        </p>
                    )}

                </form>
            </div>
        </div>
    );
};

export default TextToSign;
