import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
  name: "auth",
  initialState:{
    token:localStorage.getItem("token")||"",
    isUserLoggedIn:localStorage.getItem("token")?true:false,
    user:""
  },
  reducers: {
    
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.isUserLoggedIn = true;
      localStorage.setItem("token", action.payload.token)
      
    },

    
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isUserLoggedIn = true;
    },

   
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isUserLoggedIn = false;
      localStorage.removeItem("token")
    },
  },
});


export const { setToken, setCredentials, logout } = authSlice.actions;


export default authSlice.reducer;

