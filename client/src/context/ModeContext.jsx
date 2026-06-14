import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState('B2C');
  const [blogEnabled, setBlogEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchActiveMode = async () => {
    try {
      const { data } = await axios.get('/settings');
      if (data) {
        const activeMode = data.default_mode || data.mode || 'B2C';
        setMode(activeMode);
        const isBlogEnabled = data.blogEnabled !== undefined ? data.blogEnabled === true : true;
        setBlogEnabled(isBlogEnabled);
      }
    } catch (err) {
      console.error('Failed to load website mode setting', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveMode();
  }, []);

  const toggleMode = () => {
    const newMode = mode === 'B2B' ? 'B2C' : 'B2B';
    setMode(newMode);
  };

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode, blogEnabled, setBlogEnabled, loading, refreshMode: fetchActiveMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);
