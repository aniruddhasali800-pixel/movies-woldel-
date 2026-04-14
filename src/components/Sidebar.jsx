import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Tv, Film, PlusCircle, LayoutDashboard, Users, TrendingUp, Settings, Radio, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ isAdmin }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo">MOVIE WORLD</div>
        
        <div className="nav-group">
          <div className="nav-label">Menu</div>
          {isAdmin ? (
            <>
              <NavLink to="/admin/overview" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}><LayoutDashboard size={20} /> Overview</NavLink>
              <NavLink to="/admin/upload" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}><PlusCircle size={20} /> Upload Media</NavLink>
              <NavLink to="/admin/content" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}><Film size={20} /> Content</NavLink>
              <NavLink to="/admin/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}><Users size={20} /> Users</NavLink>
              <NavLink to="/admin/revenue" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                <TrendingUp size={20} /> Revenue
              </NavLink>
              <NavLink to="/admin/live" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                <Radio size={20} /> Live Hosting
              </NavLink>
              <NavLink to="/admin/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                <Settings size={20} /> Settings
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/tv-shows" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                <Tv size={20} /> TV Shows
              </NavLink>
              <NavLink to="/movies" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                <Film size={20} /> Movies
              </NavLink>
              <NavLink to="/new-uploads" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                <TrendingUp size={20} /> New Uploads
              </NavLink>
              <NavLink to="/my-likes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                <PlusCircle size={20} /> My Likes
              </NavLink>
            </>
          )}
        </div>

        <div className="nav-group" style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <button onClick={() => navigate('/')} className="nav-item" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
