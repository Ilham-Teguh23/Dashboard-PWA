import { configureStore } from "@reduxjs/toolkit";
import articleReducer from "./slices/articleSlice.js"
import kategoryReducer from "./slices/kategorySlice.js"

export const store = configureStore({
    reducer: {
        article: articleReducer,
        kategory: kategoryReducer
    },
})
