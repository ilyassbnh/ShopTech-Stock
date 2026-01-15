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
// 2. NOUVEAU : Supprimer un produit
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id) => {
  // On supprime côté serveur
  await fetch(`http://localhost:3001/products/${id}`, { method: 'DELETE' });
  // On retourne l'id pour le supprimer ensuite de la liste locale
  return id;
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