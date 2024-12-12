import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'
import { addKategory,getKategory,addSubKategory,getSubKategory,getWriterLists,tagsLists,addTagsApi } from '../apis/kategoryApi'



const initialState = {
    kategoryList: [],
    kategoryListLoading: false,
    kategoryListError: false,
    kategoryDetail: {},
    kategoryDetailLoading: false,
    kategoryDetailError: false,
    subCategoryList:[],
    writerList:[],
    tagsList:[]
};



export const addKategoryAction = createAsyncThunk(
    `add-kategory`,
    async(config, thunkAPI)=>{
        try {
            const response = await addKategory(config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const addSubKategoryAction = createAsyncThunk(
    `add-subkategory`,
    async(config, thunkAPI)=>{
        try {
            const response = await addSubKategory(config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const getSubKategoryAction = createAsyncThunk(
    'get-subkategory-list',
    async (config, thunkAPI) => {
        try {
            const response = await getSubKategory(config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)


export const getKategoryAction = createAsyncThunk(
    'get-kategory-list',
    async (config, thunkAPI) => {
        try {
            const response = await getKategory(config);
            console.log("Data Kategori");
            console.log(response);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const getWriterListaction = createAsyncThunk(
    'get-writer-list',
    async (config, thunkAPI) => {
        try {
            const response = await getWriterLists(config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const tagsListaction = createAsyncThunk(
    'get-tags-list',
    async (config, thunkAPI) => {
        try {
            const response = await tagsLists(config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const addTagsAction = createAsyncThunk(
    `add-tags`,
    async(config, thunkAPI)=>{
        try {
            const response = await addTagsApi(config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const kategorySlice = createSlice({
    name: 'kategory',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => { 
        builder.addCase(getKategoryAction.pending, (state, action) => {
            state.kategoryListLoading = true;
        }).addCase(getKategoryAction.fulfilled, (state, action) => {
            state.kategoryListLoading = false;
            state.kategoryList = action.payload.data;
            state.kategoryListError = false;
        }).addCase(getKategoryAction.rejected, (state, action) => {
            state.kategoryListLoading = false;
            state.kategoryListError = true;
        }).addCase(getSubKategoryAction.fulfilled, (state, action) => {
            state.subCategoryList = action.payload.data;
        }).addCase(getWriterListaction.fulfilled, (state, action) => {
            state.writerList = action.payload.data;
        }).addCase(tagsListaction.fulfilled, (state, action) => {
            state.tagsList = action.payload.data;
        })
    },
    
})

export default kategorySlice.reducer;