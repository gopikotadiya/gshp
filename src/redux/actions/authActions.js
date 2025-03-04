// redux/actions/authActions.js
import axios from 'axios';
import { REGISTER_API } from '../../constants/apis';

export const registerUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.post(REGISTER_API, userData);
    dispatch({ type: 'REGISTER_SUCCESS', payload: response.data });
    return Promise.resolve(); // Resolve the promise on success
  } catch (error) {
    dispatch({ type: 'REGISTER_FAILURE', payload: error.response?.data?.message || 'Registration failed' });
    return Promise.reject(error.response?.data?.message || 'Registration failed'); // Reject the promise on error
  }
};

