import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const glowRef = useRef(null);

  // useEffect(() => {
  //   const handleMouseMove = (e) => {
  //     setMousePosition({ x: e.clientX, y: e.clientY });
  //   };
  //   window.addEventListener('mousemove', handleMouseMove);
  //   return () => window.removeEventListener('mousemove', handleMouseMove);
  // }, []);

  // Safely calculate glow
  const getGlowStyle = () => {
    if (!glowRef.current) return { backgroundColor: '#000f' }; // fallback (bg-gray-900)
    const rect = glowRef.current.getBoundingClientRect();
    const relativeX = mousePosition.x - rect.left;
    const relativeY = mousePosition.y - rect.top;

    return {
      background: `radial-gradient(circle at ${relativeX}px ${relativeY}px,
                   rgba(99, 102, 241, 0.25),
                   rgba(17, 24, 39, 1) 40%)` // dark gray fallback
    };
  };

  return (
    <div
      ref={glowRef}
      style={getGlowStyle()}
      className="select-none  min-h-screen text-white flex items-center justify-center relative overflow-hidden transition-colors duration-200"
    >
      {/* Floating glowing particles */}
      

      {/* Main content */}
      <div className="text-center z-10 px-4">
        <motion.h1
          className="select-none text-9xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
          404
        </motion.h1>

        <motion.h2
          className="select-none text-3xl font-semibold mb-6 text-gray-300"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Oops! Page not found
        </motion.h2>

        <motion.p
          className="select-none text-lg text-gray-400 max-w-md mx-auto mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            className="select-none px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/30"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>

          <button
            className="select-none ml-4 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => (window.location.href = '/')}
          >
            Home Page
          </button>
        </motion.div>
      </div>

      {/* Footer labels */}
      <motion.div
        className="select-none absolute bottom-10 left-10 text-blue-200 text-sm opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1 }}
      >
        Error Code: 404
      </motion.div>

      <motion.div
        className="select-none absolute bottom-10 right-10 text-blue-300 text-sm opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.2 }}
      >
        Page Not Found
      </motion.div>

      {/* Grid background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
};

export default NotFoundPage;
