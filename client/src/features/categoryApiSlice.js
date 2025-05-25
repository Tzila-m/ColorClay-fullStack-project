import apiSlice from '../app/apiSlice';

const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getAllCategories: build.query({
            query: () => '/category',
            providesTags: ['Category'], 
        }),

        getCategoryById: build.query({
            query: (categoryId) => `/category/${categoryId}`
        }),

        createCategory: build.mutation({
            query: (newCategory) => ({
                url: '/category',
                method: 'POST',
                body: newCategory
            }),
            invalidatesTags: ['Category'],
        }),

        deleteCategory: build.mutation({
            query: (categoryId) => ({
                url: `/category/${categoryId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Category'], 
        })
    })
});

export const {
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation
} = productsApiSlice;
