import React, { useRef, useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { Camera } from 'lucide-react';
import { ThemeContext } from '../App';

// Interface for prediction data from backend
interface PredictionResponse {
  action: string;
  confidence: number;
  all_probabilities: Record<string, number>;
  sequence_length: number;
}

interface VideoFeedProps {
  mode: 'sign-to-text' | 'text-to-sign';
}

const VideoFeed: React.FC<VideoFeedProps> = ({ mode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { darkMode } = useContext(ThemeContext);
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sequenceRef = useRef<any[]>([]);

  // Backend URL
  const API_URL = 'http://127.0.0.1:5000/api';

  useEffect(() => {
    if (mode === 'sign-to-text') {
      const initCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: 'user'
            } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          
          // Initialize canvas size
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = 640;
            canvasRef.current.height = 480;
          }
          
          // Initialize connection with backend
          try {
            await axios.post(`${API_URL}/start-stream`);
            setError(null);
          } catch (err) {
            setError('Failed to connect to the backend server');
            console.error('Backend connection error:', err);
          }
          
        } catch (err) {
          setError('Error accessing camera. Please check permissions.');
          console.error('Error accessing camera:', err);
        }
      };

      initCamera();

      return () => {
        if (videoRef.current?.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    }
  }, [mode]);

  const captureAndSendFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw the current video frame to the canvas
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Convert canvas to base64 image
      const frameData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Send to backend with previous sequence data
      const response = await axios.post<PredictionResponse>(`${API_URL}/predict`, {
        frame: frameData,
        prevSequence: sequenceRef.current
      });
      
      // Update the sequence with new data if available
      if (response.data.sequence_length) {
        // Keep reference to sequence on the backend
        sequenceRef.current = [];
      }
      
      // Update prediction if confident enough
      if (response.data.action) {
        setPrediction(response.data.action);
        setConfidence(response.data.confidence);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error predicting:', error);
      setError('Failed to process frame');
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  useEffect(() => {
    if (mode === 'sign-to-text') {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Create new interval for processing frames
      intervalRef.current = setInterval(() => {
        captureAndSendFrame();
      }, 200); // Process at 5 frames per second
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [mode, captureAndSendFrame]);

  // Format confidence as percentage
  const confidenceDisplay = confidence ? `${(confidence * 100).toFixed(1)}%` : '';

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 w-full max-w-md mx-auto`}>  
      <div className="relative">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-[400px] object-cover rounded-lg bg-gray-100" 
        />
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={480} 
          style={{ display: 'none' }} 
        />
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full flex items-center space-x-2">
          <Camera className="h-4 w-4" />
          <span className="text-sm">Live Camera</span>
        </div>
        
        {isProcessing && (
          <div className="absolute bottom-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
            Processing...
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-600 rounded text-sm">
          {error}
        </div>
      )}
      
      <div className="mt-4 p-4 text-center">
        <div className="text-lg font-semibold">
          Detected Sign: <span className={`${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>{prediction || 'Waiting...'}</span>
        </div>
        
        {confidenceDisplay && (
          <div className="text-sm text-gray-500 mt-1">
            Confidence: {confidenceDisplay}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoFeed;