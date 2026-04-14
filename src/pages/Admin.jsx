import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, CheckCircle, Plus, Search, Trash2, Play, Eye, EyeOff, DollarSign, 
  LayoutDashboard, Users, TrendingUp, Radio, Settings, Users as UsersIcon,
  Film, PlusCircle
} from 'lucide-react';

import VideoPlayer from '../components/VideoPlayer';

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [movieList, setMovieList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Movie' });
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [msg, setMsg] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMediaUrl = (path) => {
    if (!path) return '';
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `http://localhost:5000/${cleanPath}`;
  };

  // Determine active tab from pathname
  const activeTab = location.pathname.split('/')[2] || 'overview';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/movies?admin=true'),
          axios.get('http://localhost:5000/api/users')
        ]);
        setMovieList(moviesRes.data.data || []);
        setUserList(usersRes.data.data || []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/movies/${id}`);
      setMovieList(movieList.filter(m => m._id !== id));
      setMsg({ type: 'success', text: 'Movie deleted successfully.' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete movie.' });
    }
  };

  const handleGenerateRevenue = async (id) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/movies/${id}/generate-revenue`);
      setMovieList(movieList.map(m => m._id === id ? res.data.data : m));
      setMsg({ type: 'success', text: 'Ad revenue generated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to generate ad revenue.' });
    }
  };

  const handleStatusToggle = async (movie) => {
      const newStatus = movie.status === 'public' ? 'private' : 'public';
      try {
          const res = await axios.patch(`http://localhost:5000/api/movies/${movie._id}/status`, { status: newStatus });
          setMovieList(movieList.map(m => m._id === movie._id ? res.data.data : m));
          setMsg({ type: 'success', text: `Status updated to ${newStatus}` });
      } catch (err) {
          setMsg({ type: 'error', text: 'Failed to update status.' });
      }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMsg(null);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('thumbnail', thumbnail);
    data.append('video', video);

    try {
      const res = await axios.post('http://localhost:5000/api/movies', data);
      setMsg({ type: 'success', text: 'Movie uploaded successfully!' });
      
      if (res.data.data) {
        setMovieList(prev => [...prev, res.data.data]);
      }
      
      // RESET FORM after success
      setFormData({ title: '', description: '', category: 'Movie' });
      setThumbnail(null);
      setVideo(null);
      
      const thumbInput = document.getElementById('thumb-file');
      const vidInput = document.getElementById('vid-file');
      if (thumbInput) thumbInput.value = '';
      if (vidInput) vidInput.value = '';

    } catch (err) {
      console.error('Upload error:', err);
      const errorMsg = err.response?.data?.message || 'Upload failed. Check console for details.';
      setMsg({ type: 'error', text: errorMsg });
    }
  };

  const filterMovies = movieList.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        const totalViews = movieList.reduce((acc, m) => acc + (m.views || 0), 0);
        const totalRevenue = movieList.reduce((acc, m) => acc + (m.adRevenue || 0), 0);
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
              {[
                { label: 'Total Movies', value: movieList.length, icon: <Film />, color: '#E50914' },
                { label: 'Total Views', value: totalViews, icon: <Eye />, color: '#00df9a' },
                { label: 'Ad Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: <TrendingUp />, color: '#facc15' },
                { label: 'Total Users', value: userList.length, icon: <UsersIcon />, color: '#3b82f6' }
              ].map((stat, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ padding: '0.8rem', background: `${stat.color}20`, borderRadius: 12, color: stat.color }}>{stat.icon}</div>
                  </div>
                  <p style={{ color: '#B3B3B3', fontSize: '0.9rem', marginBottom: 5 }}>{stat.label}</p>
                  <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>{stat.value}</h2>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '3rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: 16 }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Recent Performance</h3>
              <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                {movieList.slice(-10).map((m, i) => (
                  <div key={i} title={`${m.title}: ${m.views} views`} style={{ flex: 1, background: '#E50914', height: `${Math.min(100, (m.views || 0) + 10)}%`, borderRadius: '4px 4px 0 0', opacity: 0.6 + (i * 0.04) }}></div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'users':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="upload-card" style={{ maxWidth: '100%', padding: '2rem' }}>
              <h2 style={{ marginBottom: '2rem' }}>User Management</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #333' }}>
                    <th style={{ padding: '1rem', color: '#B3B3B3' }}>Name</th>
                    <th style={{ padding: '1rem', color: '#B3B3B3' }}>Email</th>
                    <th style={{ padding: '1rem', color: '#B3B3B3' }}>Role</th>
                    <th style={{ padding: '1rem', color: '#B3B3B3' }}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map(user => (
                    <tr key={user._id} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '1rem' }}>{user.name}</td>
                      <td style={{ padding: '1rem' }}>{user.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '0.2rem 0.6rem', background: user.role === 'admin' ? '#E50914' : '#333', borderRadius: 4, fontSize: '0.8rem' }}>{user.role}</span>
                      </td>
                      <td style={{ padding: '1rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {userList.length === 0 && (
                    <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#B3B3B3' }}>No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        );

      case 'revenue':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="upload-card" style={{ maxWidth: '100%', padding: '2rem' }}>
              <h2 style={{ marginBottom: '2rem' }}>Revenue Breakdown</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {movieList.map(m => (
                  <div key={m._id} style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ marginBottom: 5 }}>{m.title}</h4>
                      <p style={{ color: '#00df9a', fontSize: '0.8rem' }}>{m.views} views</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#facc15' }}>${(m.adRevenue || 0).toFixed(2)}</p>
                      <button onClick={() => handleGenerateRevenue(m._id)} style={{ fontSize: '0.7rem', color: '#B3B3B3', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Update</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'live':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="upload-card" style={{ maxWidth: '800px', padding: '4rem 2rem', textAlign: 'center', margin: '0 auto' }}>
              <Radio size={64} color="#E50914" style={{ marginBottom: '2rem' }} />
              <h2>Live Hosting Control</h2>
              <p style={{ color: '#B3B3B3', margin: '1rem 0 2rem' }}>Initialize live streaming sessions and manage real-time broadcasts.</p>
              <button disabled style={{ padding: '1rem 2rem', borderRadius: 8, background: '#333', color: '#666', border: 'none', cursor: 'not-allowed', fontWeight: 700 }}>Initialize Live Engine (Coming Soon)</button>
            </div>
          </motion.div>
        );

      case 'upload':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="upload-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2.5rem' }}><Plus size={24} style={{ verticalAlign: 'middle', marginRight: 10 }} /> Upload New Movie</h2>
            <form onSubmit={handleUpload}>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="input-box">
                  <label style={{ display: 'block', marginBottom: 8, color: '#B3B3B3' }}>Movie Title</label>
                  <input className="custom-input" type="text" placeholder="e.g. Inception" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="input-box">
                  <label style={{ display: 'block', marginBottom: 8, color: '#B3B3B3' }}>Category</label>
                  <select className="custom-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option value="Movie">Movie</option>
                    <option value="TV Show">TV Show</option>
                    <option value="New Release">New Release</option>
                  </select>
                </div>
              </div>

              <div className="input-box" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#B3B3B3' }}>Description</label>
                <textarea className="custom-input" rows="4" placeholder="Enter movie details..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
              </div>

              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div className="input-box">
                  <label style={{ display: 'block', marginBottom: 8, color: '#B3B3B3' }}>Thumbnail Image</label>
                  <div className="file-drop" onClick={() => document.getElementById('thumb-file').click()} style={{ border: thumbnail ? '2px solid #E50914' : '2px dashed #333', padding: '2rem', textAlign: 'center', cursor: 'pointer', borderRadius: 12 }}>
                    <p>{thumbnail ? thumbnail.name : 'Select Thumbnail'}</p>
                  </div>
                  <input id="thumb-file" type="file" style={{ display: 'none' }} accept="image/*" onChange={e => setThumbnail(e.target.files[0])} />
                </div>
                <div className="input-box">
                  <label style={{ display: 'block', marginBottom: 8, color: '#B3B3B3' }}>Video File</label>
                  <div className="file-drop" onClick={() => document.getElementById('vid-file').click()} style={{ border: video ? '2px solid #E50914' : '2px dashed #333', padding: '2rem', textAlign: 'center', cursor: 'pointer', borderRadius: 12 }}>
                    <p>{video ? video.name : 'Select Video'}</p>
                  </div>
                  <input id="vid-file" type="file" style={{ display: 'none' }} accept="video/*" onChange={e => setVideo(e.target.files[0])} />
                </div>
              </div>

              <button type="submit" className="btn btn-play" style={{ width: '100%', justifyContent: 'center', padding: '1rem', borderRadius: 12, background: '#E50914', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={20} /> Deploy Material
              </button>
            </form>
          </motion.div>
        );

      case 'content':
      default:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="upload-card" style={{ maxWidth: '100%', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Movie Management</h2>
                <div className="user-pill" style={{ padding: '0.4rem 1rem', background: '#333', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ background: 'none', border: 'none', color: '#fff', outline: 'none' }} 
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {filterMovies.map((movie) => (
                  <div key={movie._id} className="poster" style={{ background: '#1a1a1a', borderRadius: 12, overflow: 'hidden', border: movie.status === 'private' ? '1px solid #444' : '1px solid transparent' }}>
                    <div style={{ position: 'relative' }}>
                        <img src={getMediaUrl(movie.thumbnail)} alt={movie.title} style={{ width: '100%', height: 180, objectFit: 'cover', opacity: movie.status === 'private' ? 0.4 : 1 }} />
                        {movie.status === 'private' && (
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.8)', padding: '5px 15px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 800 }}>PRIVATE</div>
                        )}
                    </div>
                    <div style={{ padding: '1.2rem' }}>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: 5 }}>{movie.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#B3B3B3', marginBottom: 12 }}>{movie.category}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: 8 }}>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '0.7rem', color: '#B3B3B3', textTransform: 'uppercase', letterSpacing: 1 }}>Views</p>
                          <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00df9a' }}>{movie.views || 0}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '0.7rem', color: '#B3B3B3', textTransform: 'uppercase', letterSpacing: 1 }}>Revenue</p>
                          <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#facc15' }}>${movie.adRevenue || 0}</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <button 
                          onClick={() => setPlayingVideo(movie)}
                          style={{ flex: 1.5, padding: '0.7rem', background: '#E50914', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                        >
                          <Play size={16} fill="white" /> Play
                        </button>

                        <button 
                          onClick={() => handleGenerateRevenue(movie._id)}
                          title="Generate Ad Revenue"
                          style={{ flex: 1, padding: '0.7rem', background: 'rgba(250, 204, 21, 0.1)', color: '#facc15', border: '1px solid rgba(250, 204, 21, 0.3)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <DollarSign size={18} />
                        </button>
                        
                        <button 
                          onClick={() => handleStatusToggle(movie)}
                          title={movie.status === 'public' ? 'Make Private' : 'Make Public'}
                          style={{ flex: 1, padding: '0.7rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #333', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {movie.status === 'public' ? <Eye size={18} color="#00df9a" /> : <EyeOff size={18} color="#666" />}
                        </button>

                        <button 
                          onClick={() => handleDeleteMovie(movie._id)}
                          title="Delete Movie & Media"
                          style={{ flex: 1, padding: '0.7rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #333', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Trash2 size={18} color="#E50914" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="admin-view" style={{ padding: '4rem 2rem' }}>
      <div className="admin-header" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Admin Panel</h1>
          <p style={{ color: '#B3B3B3' }}>Simple Material Management</p>
        </div>
        <div className="user-pill" style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#333', padding: '0.5rem 1rem', borderRadius: 30 }}>
            <div style={{ width: 30, height: 30, background: '#E50914', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A</div>
            <span style={{ fontWeight: 600 }}>Simple Admin</span>
        </div>
      </div>

      <div className="tabs-nav" style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #333', marginBottom: '3rem', paddingBottom: '1rem', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
          { id: 'content', label: 'Manage Content', icon: <Film size={18} /> },
          { id: 'upload', label: 'Upload Materials', icon: <PlusCircle size={18} /> },
          { id: 'users', label: 'Users', icon: <Users size={18} /> },
          { id: 'revenue', label: 'Revenue', icon: <TrendingUp size={18} /> },
          { id: 'live', label: 'Live Hosting', icon: <Radio size={18} /> }
        ].map(tab => (
          <div 
            key={tab.id}
            style={{ 
              cursor: 'pointer', 
              fontWeight: 700, 
              color: activeTab === tab.id ? '#E50914' : '#B3B3B3',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap'
            }} 
            onClick={() => navigate(`/admin/${tab.id}`)}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.id && <motion.div layoutId="tab-underline" style={{ position: 'absolute', bottom: -16, left: 0, right: 0, height: 4, background: '#E50914' }} />}
          </div>
        ))}
      </div>

      {msg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ color: msg.type === 'success' ? '#00df9a' : '#E50914', marginBottom: '2rem', fontWeight: 600, padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
        </motion.div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '10rem' }}>Loading...</div>
      ) : renderTabContent()}

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

export default Admin;
