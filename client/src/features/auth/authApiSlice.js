
import apiSlice from '../../app/apiSlice'

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        register: build.mutation({
            query: (registerUser) => ({
                url: "/login/register",
                method: "POST",
                body: registerUser
            })
        }),
        login: build.mutation({
            query: (loginUser) => ({
                url: "/login/login",
                method: "POST",
                body: loginUser
            })
        })
    })
})

export const { useRegisterMutation, useLoginMutation } = authApiSlice