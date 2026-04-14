import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { X } from 'lucide-react';

const VideoPlayer = ({ videoUrl, movieId, onClose }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
    
    // TRACK VIEW
    const trackView = async () => {
      try {
        await axios.get(`http://localhost:5000/api/movies/${movieId}`);
      } catch (err) {
        console.error('Failed to track view:', err);
      }
    };
    trackView();
  }, [movieId]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: '#000',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 30, right: 30,
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          color: '#fff',
          padding: 15,
          borderRadius: '50%',
          cursor: 'pointer',
          zIndex: 10000
        }}
      >
        <X size={30} />
      </button>

      <video 
        ref={videoRef}
        src={videoUrl}
        controls
        autoPlay
        style={{ width: '100%', height: '100%', maxHeight: '100vh' }}
        onEnded={onClose}
      />
    </motion.div>
  );
};

export default VideoPlayer;
