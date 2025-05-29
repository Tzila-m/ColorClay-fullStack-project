import { configureStore } from "@reduxjs/toolkit"
import apiSlice from './apiSlice'
import authSliceReducer from "../features/auth/authSlice"
import basketReducer from "../features/basketApiSlice"  // ייבוא ה-reducer של סל הקניות
import orderReducer from "../features/orderSlice"  // ייבוא ה-reducer של סל הקניות

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    basket: basketReducer,               // הוספת ה-reducer של הסל
    order: orderReducer,               // הוספת ה-reducer של הסל
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})

export default store