import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

// 1. Fetch
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch('http://localhost:3001/products');
  return response.json();
});

// 2. Delete
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id) => {
  await fetch(`http://localhost:3001/products/${id}`, { method: 'DELETE' });
  return id;
});

// 3. NOUVEAU : Add Product
export const addProduct = createAsyncThunk('products/addProduct', async (newProduct) => {
  const response = await fetch('http://localhost:3001/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct),
  });
  return response.json();
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      // Add (On ajoute le nouveau produit à la liste existante)
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default productsSlice.reducer;