// src/redux/store.js
import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk'; // Correct import for redux-thunk
import authReducer from './reducers/authReducer'; // Import your reducer

const store = createStore(
  authReducer, // Your root reducer
  applyMiddleware(thunk) // Apply middleware (e.g., thunk)
);

export default store;