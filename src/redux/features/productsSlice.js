import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// État initial sans interface
const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Action asynchrone pour récupérer les produits
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch('http://localhost:3001/products');
  return response.json();
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Actions synchrones ici
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Erreur inconnue';
      });
  },
});

export default productsSlice.reducer;