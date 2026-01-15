import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/productsSlice';
import salesReducer from './features/salesSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    sales: salesReducer,
  },
});