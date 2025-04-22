import React, { useState, useRef, useContext } from 'react';
import { Volume2, Mic, Square } from 'lucide-react';
import { ThemeContext } from '../App';

const AudioPanel = () => {
  const { darkMode } = useContext(ThemeContext);
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      // Set up audio analysis
      audioContext.current = new AudioContext();
      analyser.current = audioContext.current.createAnalyser();
      const source = audioContext.current.createMediaStreamSource(stream);
      source.connect(analyser.current);
      
      // Configure analyser
      analyser.current.fftSize = 256;
      const bufferLength = analyser.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Update audio level visualization
      const updateLevel = () => {
        if (analyser.current && isRecording) {
          analyser.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average / 255); // Normalize to 0-1
          requestAnimationFrame(updateLevel);
        }
      };
      
      mediaRecorder.current.start();
      setIsRecording(true);
      updateLevel();
      
      mediaRecorder.current.ondataavailable = (event) => {
        // Handle recorded audio data
        const audioUrl = URL.createObjectURL(event.data);
        console.log('Recorded audio:', audioUrl);
      };
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
    if (audioContext.current) {
      audioContext.current.close();
    }
    setIsRecording(false);
    setAudioLevel(0);
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg border-t`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 rounded-full ${
                isRecording 
                  ? 'bg-red-100 text-red-500 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-500 hover:bg-blue-200'
              }`}
            >
              {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>
            <div className={`w-64 h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-100"
                style={{ width: `${audioLevel * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-500'} hover:opacity-80`}>
              <Volume2 className="h-6 w-6" />
            </button>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Audio Controls</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPanel;