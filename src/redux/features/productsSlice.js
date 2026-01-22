import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

// 1. Fetch (Lecture)
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch('http://localhost:3001/products');
  return response.json();
});

// 2. Delete (Suppression)
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id) => {
  await fetch(`http://localhost:3001/products/${id}`, { method: 'DELETE' });
  return id;
});

// 3. Add (Création)
export const addProduct = createAsyncThunk('products/addProduct', async (newProduct) => {
  const response = await fetch('http://localhost:3001/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct),
  });
  return response.json();
});

// 4. Edit (Modification)
export const editProduct = createAsyncThunk('products/editProduct', async ({ id, updatedData }) => {
  const response = await fetch(`http://localhost:3001/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  return response.json();
});

// 5. NOUVEAU : Add Sale (Ajout de vente)
export const addSale = createAsyncThunk('products/addSale', async ({ productId, saleData }) => {
  // 1. On récupère le produit actuel pour avoir ses ventes existantes
  const productRes = await fetch(`http://localhost:3001/products/${productId}`);
  const product = await productRes.json();

  // 2. On prépare la nouvelle vente
  const newSale = {
    id: Date.now().toString(), // ID unique simple
    productId,
    productName: product.name,
    category: product.category,
    ...saleData // quantity, unitPrice, date
  };

  // 3. On met à jour la liste des ventes et les stats
  const updatedSales = [...(product.sales || []), newSale];
  const updatedStats = {
    totalSales: (product.stats?.totalSales || 0) + Number(saleData.quantity),
    revenue: (product.stats?.revenue || 0) + (Number(saleData.quantity) * Number(saleData.unitPrice))
  };

  const updatedProduct = {
    ...product,
    sales: updatedSales,
    stats: updatedStats,
    // Optionnel : décrémenter le stock
    quantity: product.quantity - Number(saleData.quantity)
  };

  // 4. On sauvegarde le produit mis à jour
  const response = await fetch(`http://localhost:3001/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedProduct),
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
      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Edit
      .addCase(editProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Add Sale
      .addCase(addSale.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default productsSlice.reducer;