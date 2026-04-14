import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = () => (
  <div className="empty-state-container">
    {/* Subtle animated background element */}
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.2, 0.1]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="empty-state-bg-glow"
    />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="empty-state-content"
    >
      <h2 className="empty-state-title">
        Right now movies not available
      </h2>
      <p className="empty-state-subtitle">
        OUR CURATORS ARE CURRENTLY SELECTING CINEMATIC MASTERPIECES
      </p>
    </motion.div>
  </div>
);

export default EmptyState;
