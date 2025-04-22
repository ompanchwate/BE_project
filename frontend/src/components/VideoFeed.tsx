import React, { useRef, useEffect, useState, useContext } from 'react';
import { Camera, Video, VideoOff, CircleDot, Circle, Volume2, VolumeX } from 'lucide-react';
import { ThemeContext } from '../App';

interface VideoFeedProps {
  mode: 'sign-to-text' | 'text-to-sign';
}

const VideoFeed: React.FC<VideoFeedProps> = ({ mode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { darkMode } = useContext(ThemeContext);

  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true); // 🔈 NEW

  const API_URL = 'http://127.0.0.1:5000';

  const toggleCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
      setIsRecording(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsCameraOn(true);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsRecording(true);
    }
  };

  const toggleSound = () => {
    setIsSoundOn((prev) => !prev);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (mode === 'sign-to-text' && isCameraOn) {
      const initCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: 'user',
            },
          });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }

          if (canvasRef.current) {
            canvasRef.current.width = 640;
            canvasRef.current.height = 480;
          }

          setError(null);
        } catch (err) {
          setError('Error accessing camera. Please check permissions.');
          console.error('Camera error:', err);
        }
      };

      initCamera();

      return () => {
        if (videoRef.current?.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach((track) => track.stop());
        }
      };
    }
  }, [mode, isCameraOn]);

  const captureAndSendFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      setIsProcessing(true);
      const formData = new FormData();
      formData.append("frame", blob, "frame.jpg");

      try {
        const response = await fetch(`${API_URL}/predict-frame`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        const { label, confidence, audio } = result;

        setPrediction(label);
        setConfidence(confidence);

        if (audio && isSoundOn) {
          // Stop previous audio
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            URL.revokeObjectURL(audioRef.current.src);
          }

          const audioBlob = new Blob(
            [Uint8Array.from(atob(audio), (c) => c.charCodeAt(0))],
            { type: "audio/mp3" }
          );
          const audioUrl = URL.createObjectURL(audioBlob);
          const newAudio = new Audio(audioUrl);
          audioRef.current = newAudio;
          newAudio.play();
        }


      } catch (error) {
        console.error("Error predicting frame:", error);
      } finally {
        setIsProcessing(false);
      }
    }, "image/jpeg");
  };

  useEffect(() => {
    if (mode === 'sign-to-text' && isRecording && isCameraOn) {
      intervalRef.current = setInterval(captureAndSendFrame, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mode, isRecording, isCameraOn]);

  const confidenceDisplay = confidence ? `${(confidence * 100).toFixed(1)}%` : '';

  return (
    <div className="flex gap-16">
      <div className="w-[640px] h-[500px] relative bg-gray-300 rounded-lg overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {isCameraOn && (
          <div className="absolute top-4 left-4 animate-pulse bg-blue-500 text-white px-3 py-1 rounded-full flex items-center space-x-2">
            <Camera className="h-4 w-4" />
            <span className="text-sm">Live Camera</span>
          </div>
        )}

        <div className="absolute top-4 right-4 space-x-2 flex">
          <button
            onClick={toggleCamera}
            className={`${isCameraOn ? 'bg-gray-600' : 'bg-red-500'} text-white px-3 py-1 rounded-full text-sm hover:bg-red-600`}
          >
            {isCameraOn ? <Video /> : <VideoOff />}
          </button>

          {isCameraOn && (
            <button
              onClick={toggleRecording}
              className={`${isRecording ? 'bg-red-600' : 'bg-green-500'} flex text-white px-3 py-1 rounded-full text-sm hover:opacity-90`}
            >
              {isRecording ? <CircleDot /> : <Circle />}
              <span className="ml-1">{isRecording ? "Stop" : "Record"}</span>
            </button>
          )}

          {isCameraOn && (
            <button
              onClick={toggleSound}
              className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm hover:bg-indigo-600 flex items-center"
            >
              {isSoundOn ? <Volume2 /> : <VolumeX />}
              <span className="ml-1">{isSoundOn ? "Sound On" : "Sound Off"}</span>
            </button>
          )}
        </div>

        {isProcessing && isCameraOn && isRecording && (
          <div className="absolute bottom-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
            Processing...
          </div>
        )}
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 h-[500px] w-[500px]`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Converted Text</h2>
          {confidenceDisplay && (
            <div className={`text-sm font-bold ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>Confidence: {confidenceDisplay}</div>
          )}
        </div>
        <div className={`h-[400px] ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
          <h2 className={`text-lg font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>
            {prediction || "waiting..."}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;
