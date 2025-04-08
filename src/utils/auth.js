import store from "../redux/store";

// src/utils/auth.js
export const getAuthHeader = () => {
    const token = localStorage.getItem('token') || store.getState().auth.token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  export const getUsformatedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };