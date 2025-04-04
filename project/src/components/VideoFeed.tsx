import React, { useRef, useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { Camera } from 'lucide-react';
import { ThemeContext } from '../App';

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

  const API_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    if (mode === 'sign-to-text') {
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
  }, [mode]);

  const captureAndSendFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;

    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob as Blob), 'image/jpeg', 0.8)
      );

      const formData = new FormData();
      formData.append('frame', blob, 'frame.jpg');

      const response = await axios.post(`${API_URL}/predict-frame`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const {  label, confidence } = response.data;
      console.log("Backend response:", prediction);
      if(label && confidence){
      setPrediction(label)
      setConfidence(confidence)
      }
      setError(null);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to process frame');
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  useEffect(() => {
    if (mode === 'sign-to-text') {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        captureAndSendFrame();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [mode, captureAndSendFrame]);

 
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
        <canvas ref={canvasRef} style={{ display: 'none' }} />
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
          Detected Sign:{' '}
          <span className={darkMode ? 'text-blue-400' : 'text-blue-500'}>
            {prediction || 'Waiting...'}
          </span>
        </div>
        {confidenceDisplay && (
          <div className="text-sm text-gray-500 mt-1">Confidence: {confidenceDisplay}</div>
        )}
      </div>
    </div>
  );
};

export default VideoFeed;
