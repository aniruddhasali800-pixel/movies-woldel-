import React from 'react';
import { NavLink } from 'react-router-dom';
import { Tv, Film, Sparkles, Heart } from 'lucide-react';

const MobileNav = () => {
  return (
    <div className="mobile-nav">
      <NavLink to="/tv-shows" className="mob-nav-item">
        <Tv size={20} />
        <span>TV</span>
      </NavLink>
      <NavLink to="/movies" className="mob-nav-item">
        <Film size={20} />
        <span>Movies</span>
      </NavLink>
      <NavLink to="/new-uploads" className="mob-nav-item">
        <Sparkles size={20} />
        <span>New</span>
      </NavLink>
      <NavLink to="/my-likes" className="mob-nav-item">
        <Heart size={20} />
        <span>Likes</span>
      </NavLink>
    </div>
  );
};

export default MobileNav;
