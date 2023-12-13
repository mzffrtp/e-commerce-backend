import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../utils/api"

const initialState = {
    products: [],
    loading: false
}

export const getProducts = createAsyncThunk(
    "products",
    async () => {
        const response = await api
            .get("/products")
            .then((res) => {
                console.log(res);
            })
            .catch((err => {
                console.log(err);
            }))
    }
)

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            });
    },
});

export const { } = productSlice.actions;
export default productSlice.reducer;


