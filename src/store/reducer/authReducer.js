import { createSlice } from "@reduxjs/toolkit";

const initialState = {email: null, id: null, username:''}

export const authSlice = createSlice({
    name:'Authentication',
    initialState,
    reducers: {
        login(state, action){
            state.email = action.payload.email;
            state.username = action.payload.username;
            state.id = action.payload.id
        },
        logout(state){
            state.email = null;
            state.id = null
        }
    }
})