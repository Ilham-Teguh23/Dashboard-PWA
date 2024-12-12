import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getArticleDetail, getArticles, addArticle, updateArticle } from '../apis/articleApi.js';
const initialState = {
    articleList: [],
    articleListLoading: false,
    articleListError: false,
    articleDetail: {},
    articleDetailLoading: false,
    articleDetailError: false
};

export const getArticlesAction = createAsyncThunk(
    'get-article-list',
    async (config, thunkAPI) => {
        try {
            const response = await getArticles(config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)   
export const getArticleDetailAction = createAsyncThunk(
    'get-article-detail',
    async (config, thunkAPI) => {
        try {
            const response = await getArticleDetail(config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)   
export const addArticleAction = createAsyncThunk(
    `add-article`,
    async(config, thunkAPI)=>{
        try {
            const response = await addArticle(config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)
export const editArticleAction = createAsyncThunk(
    `update-article`,
    async(config, thunkAPI)=>{
        try {
            const response = await updateArticle(config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)
export const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => { 
        builder.addCase(getArticlesAction.pending, (state, action) => {
            state.articleListLoading = true;
        }).addCase(getArticlesAction.fulfilled, (state, action) => {
            state.articleListLoading = false;
            state.articleList = action.payload.data;
            state.articleListError = false;
        }).addCase(getArticlesAction.rejected, (state, action) => {
            state.articleListLoading = false;
            state.articleListError = true;
        }).addCase(getArticleDetailAction.pending, (state, action) => {
            state.articleDetailLoading = true;
        }).addCase(getArticleDetailAction.fulfilled, (state, action) => {
            state.articleDetailLoading = false;
            state.articleDetail = action.payload.data;
            state.articleDetailError = false;
        }).addCase(getArticleDetailAction.rejected, (state, action) => {
            state.articleDetailLoading = false;
            state.articleDetailError = true;
        })
    },
    
})
export default articleSlice.reducer;