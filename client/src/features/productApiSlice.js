import apiSlice from '../app/apiSlice'

const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({

        getAllProducts: build.query({
            query: () => '/product',
            providesTags: ['Product'],
        }),

        getProductByCategory: build.query({
            query: (categoryId) => `/product/byCategory/${categoryId}`,
            providesTags: ['Product'],
        }),

        createProduct: build.mutation({
            query: (newProduct) => ({
                url: '/product',
                method: 'POST',
                body: newProduct
            }),
            invalidatesTags: ['Product'],
        }),

        updateAvailableProduct: build.mutation({
            query: (id) => ({
                url: `/product/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: ['Product'],
        }),

        deleteProduct: build.mutation({
            query: (id) => ({
                url: `/product/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Product'],
        })

    })
})

export const {
    useGetAllProductsQuery,
    useGetProductByCategoryQuery,
    useCreateProductMutation,
    useUpdateAvailableProductMutation,
    useDeleteProductMutation
} = productsApiSlice
