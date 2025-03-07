import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { 
    createEmployee, 
    getEmployees, 
} from "./PostApi";

const initialState = {
    status: "idle",
    posts: [],
    selectedPost: null,
    postAddStatus: "idle",
    postFetchStatus: "idle",
    errors: null,
    successMessage: null
};

// Async Thunks
export const createPostAsync = createAsyncThunk("posts/createPostAsync", async ({ postDetails }) => {
    const newPost = await createEmployee(postDetails);
    return newPost;
});

export const fetchPostsAsync = createAsyncThunk("posts/fetchPostsAsync", async () => {
    const posts = await getEmployees();
    return posts;
});

// Slice
const postSlice = createSlice({
    name: "postSlice",
    initialState,
    reducers: {
        clearPostErrors: (state) => {
            state.errors = null;
        },
        clearPostSuccessMessage: (state) => {
            state.successMessage = null;
        },
        resetPostStatus: (state) => {
            state.status = "idle";
        },
        clearSelectedPost: (state) => {
            state.selectedPost = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Post
            .addCase(createPostAsync.pending, (state) => {
                state.postAddStatus = "pending";
            })
            .addCase(createPostAsync.fulfilled, (state) => {
                state.postAddStatus = "fulfilled";
            })
            
            .addCase(createPostAsync.rejected, (state, action) => {
                state.postAddStatus = "rejected";
                state.errors = action.error.message;
            })

            // Fetch Posts
            .addCase(fetchPostsAsync.pending, (state) => {
                state.postFetchStatus = "pending";
            })
            .addCase(fetchPostsAsync.fulfilled, (state, action) => {
                state.postFetchStatus = "fulfilled";
                state.posts = action.payload;
                state.successMessage = null;
            })
            .addCase(fetchPostsAsync.rejected, (state, action) => {
                state.postFetchStatus = "rejected";
                state.errors = action.error.message; // Fix incorrect error access
            })
    }
});

// Exporting Selectors
export const selectPostStatus = (state) => state.postSlice.status;
export const selectPosts = (state) => state.postSlice.posts;
export const selectPostErrors = (state) => state.postSlice.errors;
export const selectPostSuccessMessage = (state) => state.postSlice.successMessage;
export const selectPostAddStatus = (state) => state.postSlice.postAddStatus;
export const selectPostFetchStatus = (state) => state.postSlice.postFetchStatus;

// Exporting Actions
export const { clearPostErrors, clearPostSuccessMessage, resetPostStatus, clearSelectedPost } = postSlice.actions;

export default postSlice.reducer;
