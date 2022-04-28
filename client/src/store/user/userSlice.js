import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    fetchUser as API_fetchUser,
    patchUser as API_patchUser,
} from '../../api/user'
import {getCurrentAccount} from '../../services/Web3/web3'

import { LS_KEY } from "../../constant";


const initialState = {
    user: null,
    accessToken: localStorage.getItem(LS_KEY) || null,
    error: null,
    status: 'idle',
}

export const fetchUser = createAsyncThunk('user/fetchUser', async (accessToken, {rejectWithValue}) => {
    try{
        let user = await API_fetchUser(accessToken)
        const currenctAccount = await getCurrentAccount()
        if(user.publicAddress !== currenctAccount){
            localStorage.removeItem(LS_KEY);
            return {  user: null , accessToken: null }
        }
        return {  user, accessToken }
    }catch(err){
        return rejectWithValue([], err);
    }
   

})
export const patchUser = createAsyncThunk('user/patchUser', async (data, { getState }) => {
    const state = getState()
    let user = await API_patchUser(state.user.accessToken, data)
    console.log(user)
    return user
    

})


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAccessToken:{
            reducer(state, action){
                state.accessToken = action.payload
            }
        },
        loggedIn: {
            reducer(state, action) {
                state.accessToken = action.payload
                state.status = 'succeeded'
            
            },
            prepare(accessToken) {
                // im not sure which function should i use to store the token to the localstore
                // might change this later
                localStorage.setItem(LS_KEY, accessToken);
                
                return {
                    payload: accessToken,
                }
            }
        },
        logOut: {
            reducer(state, action) {
                state.accessToken = null
                state.user = null
                state.error = null
                state.status = 'logout'
            },
            prepare(accessToken) {
                // im not sure which function should i use to store the token to the localstore
                // might change this later
                localStorage.removeItem(LS_KEY);
                return {
                    payload: accessToken
                }
            }
        },
        updateUser:{
            reducer(state, action) {
                state.user = action.payload
            },
        }
    },
    extraReducers: {
        [fetchUser.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchUser.fulfilled]:  (state, action) => {
            // check current public key and user pubic key macthes
            state.status = 'succeeded'
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken

        },
        [fetchUser.rejected]: (state, action) => {
            state.accessToken = null
            state.user = null
            state.error = null
            state.status = 'failed'
            state.error = action.error.message
            localStorage.removeItem(LS_KEY);
        },
        [patchUser.pending]: (state, action) => {
            state.status = 'loading'
        },
        [patchUser.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.user = action.payload
        },
        [patchUser.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        },
     

    }
})



export const { loggedIn, logOut, setAccessToken,updateUser } = userSlice.actions

export default userSlice.reducer
