import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { Play, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyLikes = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMediaUrl = (path) => {
    if (!path) return '';
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `http://localhost:5000/${cleanPath}`;
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/movies/');
        const moviesData = res.data.data || [];
        // Simulating "My Likes" by taking a subset of available movies
        setList(moviesData.slice(0, 5));
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  const removeFromList = (id) => {
    setList(list.filter(m => m._id !== id));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="home-view" style={{ padding: '4rem 2rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '3rem' }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>My Likes</h1>
        <p style={{ color: '#B3B3B3', marginTop: '0.5rem' }}>Your personal collection of cinematic masterpieces.</p>
      </motion.div>

      {list.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '10rem' }}>
          <h2 style={{ color: '#333' }}>Your list is empty.</h2>
          <button className="btn btn-play" style={{ marginTop: '1.5rem' }} onClick={() => window.location.href='/'}>Browse Movies</button>
        </div>
      ) : (
        <div className="movie-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
          <AnimatePresence>
            {list.map((movie, index) => (
              <motion.div 
                key={movie._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                className="poster"
                style={{ position: 'relative' }}
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
                  <button className="btn btn-play" style={{ padding: '0.6rem 1rem' }}><Play size={16} fill="black" /> Play</button>
                  <button 
                    onClick={() => removeFromList(movie._id)}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.6rem', borderRadius: '50%', cursor: 'pointer' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <style>{`
        .poster:hover .poster-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default MyLikes;
