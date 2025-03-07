import { configureStore } from '@reduxjs/toolkit'
import postSlice from '../features/post/PostSlice.jsx'


export const store = configureStore({
    reducer: {
        postSlice,
    }
})