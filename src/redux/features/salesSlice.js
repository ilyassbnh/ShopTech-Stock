import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// État initial
const initialState = {
  salesList: [],
  globalStats: {
    totalStock: 0,
    totalStockValue: 0,
    productsSold: 0,
    totalSalesValue: 0
  },
  status: 'idle',
  error: null,
};

// On récupère les ventes ET les stats en parallèle
export const fetchSalesData = createAsyncThunk('sales/fetchSalesData', async () => {
  const [salesRes, statsRes] = await Promise.all([
    fetch('http://localhost:3001/sales'),
    fetch('http://localhost:3001/stats')
  ]);
  
  const sales = await salesRes.json();
  const stats = await statsRes.json();
  
  return { sales, stats };
});

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSalesData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.salesList = action.payload.sales;
        state.globalStats = action.payload.stats;
      });
  },
});

export default salesSlice.reducer;