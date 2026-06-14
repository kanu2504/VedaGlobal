import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HeroVideoSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const videos = [
    "/videos/agriculture-1.mp4",
    "/videos/agriculture-2.mp4",
    "/videos/agriculture-3.mp4",
    "/videos/agriculture-4.mp4"
  ];

  useEffect(() => {
    setIsLoaded(false); // Reset loaded state on video index change to trigger fade-in
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 7000); // Smooth fade transition every 7 seconds

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="hero-video-slider">
      <video
        key={currentIndex}
        src={videos[currentIndex]}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={`hero-video slider-video ${isLoaded ? 'loaded' : ''}`}
        onLoadedData={() => setIsLoaded(true)}
        onError={() => {
          console.log("Video failed to load:", videos[currentIndex]);
          // Automatically switch to the next video if loading fails
          setCurrentIndex((prev) => (prev + 1) % videos.length);
        }}
      />
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <h1>Welcome To Veda Global</h1>
        <p>Premium Products from Our Fields to Your Table</p>
      </motion.div>
    </div>
  );
};

export default HeroVideoSlider;


