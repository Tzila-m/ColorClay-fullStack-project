import { createSlice } from "@reduxjs/toolkit"

const initVal = {
    userDetails: {
        name: null,
        username: null,
        email: null,
        phone:null,
        role: null
    }
}

const userDetailsSlice = createSlice({
    name: "userDetails",
    initialState: initVal,
    reducers: {
        setUserDetails: (state, action) => {
            console.log("action",action);
            state.userDetails.name = action.payload.name;
            state.userDetails.username = action.payload.username;
            state.userDetails.email = action.payload.email;
            state.userDetails.phone = action.payload.phone;
            state.userDetails.role = action.payload.role;
            console.log("in state:", state);

        },
        clearUserDetails(state) {
            state.userDetails.name = null;
            state.userDetails.username = null;
            state.userDetails.email = null;
            state.userDetails.phone = null;
            state.userDetails.role = null;
            console.log("cleared userDetails");
        }
    }
})

export const { setUserDetails, clearUserDetails } = userDetailsSlice.actions
export default userDetailsSlice.reducer