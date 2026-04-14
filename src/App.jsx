import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Admin from './pages/Admin';
import MyLikes from './pages/MyLikes';
import CategoryPage from './pages/CategoryPage';
import NewUploads from './pages/NewUploads';
import EmptyState from './pages/EmptyState';
import MobileNav from './components/MobileNav';

import './index.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <Sidebar isAdmin={isAdmin} />
      <div className="main-content">
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<NewUploads />} />
          <Route path="/tv-shows" element={<CategoryPage category="TV Show" title="TV Shows" description="Binge-worthy series and trending shows." />} />
          <Route path="/movies" element={<CategoryPage category="Movie" title="Movies" description="Blockbusters, indie gems, and cinematic masterpieces." />} />
          <Route path="/new-uploads" element={<NewUploads />} />
          <Route path="/my-likes" element={<MyLikes />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
