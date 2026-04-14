import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayer from '../components/VideoPlayer';

const CategoryPage = ({ category, title, description }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState(null);

  const getMediaUrl = (path) => {
    if (!path) return '';
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `http://localhost:5000/${cleanPath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/movies/');
        const moviesData = res.data.data || [];
        const filtered = moviesData.filter(m => m.category === category && m.status === 'public');
        setMovies(filtered);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  if (loading) return <div className="loading">Loading {title}...</div>;

  return (
    <div className="home-view" style={{ padding: '4rem 2rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '3rem' }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>{title}</h1>
        <p style={{ color: '#B3B3B3', marginTop: '0.5rem', maxWidth: '600px' }}>{description}</p>
      </motion.div>

      {movies.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '10rem' }}>
          <h2 style={{ color: '#333' }}>No {title} available right now.</h2>
          <p style={{ color: '#666' }}>Check back later for new additions!</p>
        </div>
      ) : (
        <div className="movie-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
          {movies.map((movie, index) => (
            <motion.div 
              key={movie._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="poster"
            >
              <img src={getMediaUrl(movie.thumbnail)} alt={movie.title} style={{ borderRadius: 12 }} />
              <div className="poster-overlay" style={{ 
                position: 'absolute', 
                top: 0, left: 0, right: 0, bottom: 0, 
                background: 'rgba(0,0,0,0.6)', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: 15,
                opacity: 0,
                transition: 'opacity 0.3s',
              }}>
                <button 
                  className="btn btn-play" 
                  style={{ padding: '0.6rem 1rem' }}
                  onClick={() => setPlayingVideo(movie)}
                >
                  <Play size={16} fill="black" /> Play
                </button>
                <button className="btn btn-info" style={{ padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.2)', border: 'none' }}><Info size={16} /> Details</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <style>{`
        .poster:hover .poster-overlay {
          opacity: 1 !important;
        }
      `}</style>

      <AnimatePresence>
        {playingVideo && (
          <VideoPlayer 
            videoUrl={getMediaUrl(playingVideo.videoUrl)} 
            movieId={playingVideo._id}
            onClose={() => setPlayingVideo(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryPage;
