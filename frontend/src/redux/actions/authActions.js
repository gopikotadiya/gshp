import axios from 'axios';
import { LOGIN_API, USER_BASE_API, REGISTER_API } from '../../constants/apis'; 
import { Navigate } from 'react-router-dom';

// Registration Action
export const registerUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.post(REGISTER_API, userData);
    return Promise.resolve();
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Registration failed';
    dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
    return Promise.reject(errorMessage);
  }
};

// Login Action
export const loginUser = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post(LOGIN_API, null, {
      params: { email, password }
    });
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    console.log(response.data.user);
    dispatch({ type: 'AUTH_SUCCESS', payload: {
      user: response.data.user,
      token: response.data.access_token
    } });
    return Promise.resolve();
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
    return Promise.reject(errorMessage);
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  dispatch({ type: 'LOGOUT' });
};



export const updateUserProfile = (userId, values, headers) => async (dispatch) => {
  try {
    const response = await axios.put(
      `${USER_BASE_API}/${userId}`,
      values,
      { headers }
    );
    const updatedUser = response.data;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_USER_SUCCESS', payload: updatedUser });
    return Promise.resolve();
  } catch (error) {
    const errorMessage = error.response?.data?.detail || 'Profile update failed';
    dispatch({ type: 'PROFILE_UPDATE_FAILURE', payload: errorMessage });
    return Promise.reject(errorMessage);
  }
};