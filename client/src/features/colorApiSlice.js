import apiSlice from '../app/apiSlice'

const colorsApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getAllColors: build.query({
            query: () => '/color',
            providesTags: ['Color'],

        }),
        getColorById: build.query({
            query: (id) => `/color/${id}`
        }),
        createColor: build.mutation({
            query: (newColor) => ({
                url: '/color',
                method: 'POST',
                body: newColor
            }),
            invalidatesTags: ['Color'],
        }),
        updateAvailableColor: build.mutation({
            query: (id) => ({
                url: `/color/${id}`,
                method: 'PUT'
            }),
            invalidatesTags: ['Color'],
        }),
        deleteColor: build.mutation({
            query: (id) => ({
                url: `/color/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Color'],
        })
    })
})

export const {
    useGetAllColorsQuery,
    useGetColorByIdQuery,
    useCreateColorMutation,
    useUpdateAvailableColorMutation,
    useDeleteColorMutation
} = colorsApiSlice
