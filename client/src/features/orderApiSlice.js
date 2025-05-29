import apiSlice from '../app/apiSlice';

const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST - יצירת הזמנה עם userId, tableId, date, timeSlot
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/order',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order', 'Table'],
    }),

    // PUT - הוספת מוצרים וצבעים להזמנה
    addProductsAndColors: builder.mutation({
      query: ({ orderId, productIds, colorIds }) => ({    
        url: `/order/addProductsAndColors/${orderId}`,
        method: 'PUT',
        body: { productIds, colorIds },
      }),
      invalidatesTags: ['Order', 'Product', 'Color'],
    }),

    // PUT - אישור תשלום
    confirmOrderPayment: builder.mutation({
      query: (orderId) => ({
        url: `/order/confirmOrderPayment/${orderId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),

    // PUT - סימון הזמנה כמוכנה (כולל שליחת מייל)
    markOrderReady: builder.mutation({
      query: (orderId) => ({
        url: `/order/markOrderReady/${orderId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),

    // GET - שליפת הזמנה לפי מזהה
    getOrderById: builder.query({
      query: (id) => `/order/${id}`,
      providesTags: ['Order'],
    }),

    // GET שליפת הזמנות לפי סטטוס
    getOrdersByStatus: builder.query({
      query: (status) => `/order/status/${status}`,
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useAddProductsAndColorsMutation,
  useConfirmOrderPaymentMutation,
  useMarkOrderReadyMutation,
  useGetOrderByIdQuery,
  useGetOrdersByStatusQuery,
} = orderApiSlice;
