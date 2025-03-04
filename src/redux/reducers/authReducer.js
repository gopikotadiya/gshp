// src/redux/reducers/authReducer.js
const initialState = {
    user: null,
    error: null,
    loading: false,
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'AUTH_SUCCESS':
        return {
          ...state,
          user: action.payload,
          error: null,
          loading: false,
        };
      case 'AUTH_FAILURE':
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      default:
        return state;
    }
  };
  
  export default authReducer;