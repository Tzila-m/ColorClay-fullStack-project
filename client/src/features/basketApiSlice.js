import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orderId: null,
  products: [],
  colors: [],
  totalProductsPrice: 0,
  totalColorsPrice: 0,
  totalPrice: 0,
};

const basketApiSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const newProduct = action.payload;
      const existing = state.products.find(p => p.code === newProduct.code);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.products.push({ ...newProduct, quantity: 1 });
      }

      state.totalProductsPrice += newProduct.price;
      state.totalPrice = state.totalProductsPrice + state.totalColorsPrice;
    },

    removeProduct: (state, action) => {
      const code = action.payload;
      const productToRemove = state.products.find(p => p.code === code);
      if (productToRemove) {
        state.totalProductsPrice -= productToRemove.price * productToRemove.quantity;
        state.products = state.products.filter(p => p.code !== code);
        state.totalPrice = state.totalProductsPrice + state.totalColorsPrice;
      }
    },

    increaseProductQuantity: (state, action) => {
      const code = action.payload;
      const product = state.products.find(p => p.code === code);
      if (product) {
        product.quantity += 1;
        state.totalProductsPrice += product.price;
        state.totalPrice = state.totalProductsPrice + state.totalColorsPrice;
      }
    },

    decreaseProductQuantity: (state, action) => {
      const code = action.payload;
      const product = state.products.find(p => p.code === code);
      if (product) {
        if (product.quantity > 1) {
          product.quantity -= 1;
          state.totalProductsPrice -= product.price;
        } else {
          state.products = state.products.filter(p => p.code !== code);
          state.totalProductsPrice -= product.price;
        }
        state.totalPrice = state.totalProductsPrice + state.totalColorsPrice;
      }
    },

    addColor: (state, action) => {
      const newColor = action.payload;
      const existing = state.colors.find(c => c.code === newColor.code);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.colors.push({ ...newColor, quantity: 1 });
      }

      state.totalColorsPrice += newColor.price || 0;
      state.totalPrice = state.totalProductsPrice + state.totalColorsPrice;
    },

    removeColor: (state, action) => {
      const code = action.payload;
      const colorToRemove = state.colors.find(c => c.code === code);
      if (colorToRemove) {
        state.totalColorsPrice -= (colorToRemove.price || 0) * colorToRemove.quantity;
        state.colors = state.colors.filter(c => c.code !== code);
        state.totalPrice = state.totalProductsPrice + state.totalColorsPrice;
      }
    },

    increaseColorQuantity: (state, action) => {
      const code = action.payload;
      const color = state.colors.find(c => c.code === code);
      if (color) {
        color.quantity += 1;
        state.totalColorsPrice += color.price || 0;
        state.totalPrice = state.totalProductsPrice + state.totalColorsPrice;
      }
    },

    decreaseColorQuantity: (state, action) => {
      const code = action.payload;
      const color = state.colors.find(c => c.code === code);
      if (color) {
        if (color.quantity > 1) {
          color.quantity -= 1;
          state.totalColorsPrice -= color.price || 0;
        } else {
          state.colors = state.colors.filter(c => c.code !== code);
          state.totalColorsPrice -= color.price || 0;
        }
        state.totalPrice = state.totalProductsPrice + state.totalColorsPrice;
      }
    },

    setOrderId: (state, action) => {
      state.orderId = action.payload;
    },

    clearBasket: (state) => {
      // state.orderId = null;
      state.products = [];
      state.colors = [];
      state.totalProductsPrice = 0;
      state.totalColorsPrice = 0;
      state.totalPrice = 0;
    },
  },
});

export const {
  addProduct,
  removeProduct,
  increaseProductQuantity,
  decreaseProductQuantity,
  addColor,
  removeColor,
  increaseColorQuantity,
  decreaseColorQuantity,
  setOrderId,
  clearBasket,
} = basketApiSlice.actions;

export default basketApiSlice.reducer;
