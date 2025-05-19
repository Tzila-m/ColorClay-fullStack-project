import { configureStore } from "@reduxjs/toolkit"
import apiSlice from "./apiSlice"

const store = configureStore({
  reducer: {
    auth:authSliceReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },

  middleware: (defaultMiddleware) => defaultMiddleware().concat(apiSlice.middleware),

  devTools: true

})

export default store