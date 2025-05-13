const { createApi, fetchBaseQuery } = '@reduxjs/toolkit/query/react';

const apiSlice = createApi({
   
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:1100' 
    }),

    endPoints: () => ({})
});
