import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
  name: "auth",
 initialState: {
  token: localStorage.getItem("token") || "",
  isUserLoggedIn: localStorage.getItem("token") ? true : false,
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
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
       localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
    },

   
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isUserLoggedIn = false;
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    },
  },
});


export const { setToken, setCredentials, logout } = authSlice.actions;


export default authSlice.reducer;

