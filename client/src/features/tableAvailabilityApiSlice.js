import apiSlice from '../app/apiSlice';

const tableAvailabilityApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAvailableTables: build.query({
      query: ({ date, timeSlot }) => ({
        url: `/tableAvailability`,
        params: { date, timeSlot }
      }),
      providesTags: ['Availability']
    }),

    createReservation: build.mutation({
      query: (reservationData) => ({
        url: '/order',
        method: 'POST',
        body: reservationData
      }),
      invalidatesTags: ['Availability']
    })
  })
});

export const {
  useGetAvailableTablesQuery,
  useCreateReservationMutation
} = tableAvailabilityApiSlice;
