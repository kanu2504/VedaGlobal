import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    const local = localStorage.getItem('veda_customer');
    return local ? JSON.parse(local) : null;
  });

  const login = async (email, password) => {
    try {
      const res = await axios.post('/users/login', { email, password });
      const user = res.data;
      setCustomer(user);
      localStorage.setItem('veda_customer', JSON.stringify(user));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Invalid email or password'
      };
    }
  };

  const register = async (name, email, password, phone = '') => {
    try {
      const res = await axios.post('/users/register', { name, email, password, phone });
      const user = res.data;
      setCustomer(user);
      localStorage.setItem('veda_customer', JSON.stringify(user));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    setCustomer(null);
    localStorage.removeItem('veda_customer');
  };

  const updateProfile = async (profileData) => {
    if (!customer || !customer._id) return { success: false, message: 'No customer logged in' };
    
    try {
      const res = await axios.put(`/users/customers/profile/${customer._id}`, profileData);
      const updatedCustomer = res.data;
      setCustomer(updatedCustomer);
      localStorage.setItem('veda_customer', JSON.stringify(updatedCustomer));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Profile update failed'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
