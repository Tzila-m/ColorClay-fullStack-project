import { createSlice } from "@reduxjs/toolkit"

const initVal = {
    token:null 
}

const tokenSlice = createSlice({
    name:"token",
    initialState:initVal,
    reducers:{
        setToken:(state,action)=>{
            console.log(state);
            console.log("before",action.payload);
            state.token=action.payload
            console.log(state.token);
        },
        clearToken(state) {
            state.token = initVal;
        }
    }
})

export const {setToken,clearToken} = tokenSlice.actions
export default tokenSlice.reducer