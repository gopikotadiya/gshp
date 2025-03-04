import axios from 'axios';
import { LOGIN_API, REGISTER_API } from '../../constants/apis'; // Import both APIs

// Registration Action
export const registerUser = (userData, navigate) => async (dispatch) => {
  try {
    const response = await axios.post(REGISTER_API, userData);
    dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
    return Promise.resolve();
    // navigate('/'); // Use the navigate function to redirect
  } catch (error) {
    dispatch({ type: 'AUTH_FAILURE', payload: error.response?.data?.message || 'Registration failed' });
  }
};

// Login Action
export const loginUser = (email, password, navigate) => async (dispatch) => {
  try {
    const response = await axios.post(LOGIN_API, null, {
      params: { email, password }, // Send email and password as query parameters
    });

    // Save the JWT token to localStorage or sessionStorage
    localStorage.setItem('token', response.data.token);

    dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user }); // Dispatch user data
    return Promise.resolve();
    // navigate('/'); // Use the navigate function to redirect
  } catch (error) {
    dispatch({ type: 'AUTH_FAILURE', payload: error.response?.data?.message || 'Login failed' });
  }
};