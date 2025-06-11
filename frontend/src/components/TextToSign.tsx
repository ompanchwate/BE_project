import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';


export const TextToSign = () => {
    const { darkMode } = useContext(ThemeContext);

    const [timeOfDay, setTimeOfDay] = useState({
        morning: false,
        afternoon: false,
        night: false,
    });

    const [pillType, setPillType] = useState('');
    const [pillCount, setPillCount] = useState('');
    const [mealTiming, setMealTiming] = useState('');
    const [time, setTime] = useState([]);
    const [pill, setPill] = useState('');
    const [videoSources, setVideoSources] = useState([]);

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
        const selectedTimes = ['morning', 'afternoon', 'night'].filter((t) => timeOfDay[t]);

        if (selectedTimes.length === 0 || !pillType || !pillCount || !mealTiming) {
            alert('Please select time of day, pill type, pill count, and meal timing.');
            return;
        }

        setTime(selectedTimes);
        setPill(pillType);
        console.log(selectedTimes)

        const canvas = document.querySelector('canvas');
        const basePath = '/assets/';
        const sources = [];

        // Video order: pillCount → pillType → medicine → mealTiming → timeOfDay
        sources.push(`${basePath}${pillCount}.mp4`);
        sources.push(`${basePath}${pillType}.mp4`);
        sources.push(`${basePath}medicine.mp4`);
        sources.push(`${basePath}${mealTiming}.mp4`);
        sources.push(`${basePath}${"meal"}.mp4`);
        selectedTimes.forEach((t) => sources.push(`${basePath}${t}.mp4`));
        console.log(sources)

        setVideoSources(sources);
        playVideosSequentially(sources, canvas);
    };

    const playVideosSequentially = async (videoSources, canvas) => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const src of videoSources) {
            await new Promise((resolve) => {
                const video = document.createElement('video');
                video.src = src;
                video.crossOrigin = 'anonymous';
                video.playsInline = true;
                video.muted = true;
                video.autoplay = false;
                video.width = canvas.width;
                video.height = canvas.height;

                let animationFrameId;

                video.onended = () => {
                    cancelAnimationFrame(animationFrameId); // Stop drawing
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Ensure final frame is drawn
                    resolve();
                };

                video.onerror = (e) => {
                    console.error('Video error for', src, e);
                    resolve(); // Skip this video on error
                };

                video.oncanplay = async () => {
                    try {
                        await video.play();

                        const drawFrame = () => {
                            if (!video.paused && !video.ended) {
                                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                                animationFrameId = requestAnimationFrame(drawFrame);
                            }
                        };

                        drawFrame();
                    } catch (err) {
                        console.error('Play failed for:', src, err);
                        resolve();
                    }
                };

                video.load(); // Start loading
            });
        }
    };



    return (
        <div className={`flex gap-16`}>
            {/* Video section */}
            <div className="w-[800px] h-[500px] relative bg-gray-300 rounded-lg overflow-hidden">
                <canvas width="800" height="500" />
            </div>

            {/* Form section */}
            <div
                className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    } rounded-lg shadow-lg p-6 h-[500px] w-[500px] overflow-y-auto`}
            >
                {/* Text Summary */}
                {pill && time.length > 0 && pillCount && mealTiming && (
                    <p className="mt-2 text-base">
                        Take <strong>{pillCount}</strong> <strong>{pill}</strong> pill,
                        <strong> {mealTiming.replace('_', ' ')}</strong> meal in <strong>{time.join(', ')}</strong>.
                    </p>
                )}
                <form className={` flex flex-col gap-6 mt-5`}>
                    {/* Time of Day */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Time of Day</h2>
                        <div className="flex gap-4">
                            {['morning', 'afternoon', 'night'].map((time) => (
                                <button
                                    key={time}
                                    type="button"
                                    onClick={() => handleTimeChange(time)}
                                    className={` ${darkMode ? 'text-white' : ''} px-4 py-2 rounded-full border ${timeOfDay[time]
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
                                    className={` ${darkMode ? 'text-white' : ''} px-4 py-2 rounded-full border ${pillType === type
                                        ? 'bg-green-600 text-white border-green-600'
                                        : 'bg-transparent text-gray-600 border-gray-400'
                                        } transition duration-200`}
                                >
                                    {type} pill
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pill Count */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Pill Count</h2>
                        <div className="flex gap-4">
                            {['one', 'two', 'three', 'four'].map((count) => (
                                <button
                                    key={count}
                                    type="button"
                                    onClick={() => setPillCount((prev) => prev === count ? '' : count)}
                                    className={` ${darkMode ? 'text-white' : ''} px-4 py-2 rounded-full border ${pillCount === count
                                        ? 'bg-pink-600 text-white border-pink-600'
                                        : 'bg-transparent text-gray-600 border-gray-400'
                                        } transition duration-200`}
                                >
                                    {count}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Meal Timing */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Meal Timing</h2>
                        <div className="flex gap-4">
                            {['before', 'during', 'after'].map((meal) => (
                                <button
                                    key={meal}
                                    type="button"
                                    onClick={() => setMealTiming((prev) => prev === meal ? '' : meal)}
                                    className={` ${darkMode ? 'text-white' : ''} px-4 py-2 rounded-full border ${mealTiming === meal
                                        ? 'bg-yellow-600 text-white border-yellow-600'
                                        : 'bg-transparent text-gray-600 border-gray-400'
                                        } transition duration-200`}
                                >
                                    {meal.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-5 justify-center items-center">
                        <button
                            type="button"
                            className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            onClick={handleConvert}
                        >
                            Convert
                        </button>

                        {/* Replay Button */}
                        {videoSources.length > 0 && (
                            <button
                                type="button"
                                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                                onClick={() => {
                                    const canvas = document.querySelector('canvas');
                                    playVideosSequentially(videoSources, canvas);
                                }}
                            >
                                Replay
                            </button>
                        )}
                    </div>
                    {/* Convert Button */}

                </form>
            </div>
        </div>
    );
};

export default TextToSign;
