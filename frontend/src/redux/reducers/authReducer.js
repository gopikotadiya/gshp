const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, 
  token: localStorage.getItem('token') || null,
  error: null,
  isLoggedIn: !!localStorage.getItem('token'), 
};
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'AUTH_SUCCESS':
        return {
          ...state,
          ...action.payload,
          error: null,
          isLoggedIn: true,
        };
      case 'AUTH_FAILURE':
        return {
          ...state,
          error: action.payload,
          isLoggedIn: false,
        };
      case 'LOGOUT':
        return {
          ...initialState,
          user: null,
          token: null,
          isLoggedIn: false,
        }; 
        case 'UPDATE_USER_SUCCESS':
          return {
            ...state,
            user: action.payload, // Update user data with new payload
            error: null
          };
        
        case 'PROFILE_UPDATE_FAILURE':
          return {
            ...state,
            // error: action.payload
          };
      default:
        return state;
    }
  };
  
  export default authReducer;