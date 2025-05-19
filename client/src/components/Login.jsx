import React,{useEffect} from "react";
import {useLoginMutation} from './authApiSlice'
import { useForm, SubmitHandler } from "react-hook-form"
import { useDispatch } from "react-redux";
import { setToken } from "./authSlice";

const Login=()=>{
    const dispach=useDispatch() 
    const [loginFunc,{data, error, isLoading,isSuccess,isError }]=useLoginMutation()
    

    const { register, handleSubmit } = useForm()
  const onSubmit = (data) =>{loginFunc(data)}

  useEffect(
    ()=>{
        if(isSuccess)
            dispach(setToken(data))
    },[isSuccess]
  )
  
  return (

    <form onSubmit={handleSubmit(onSubmit)}>
      
     
      <input {...register("username", { required: true}) }placeholder="username"  />
      <br/>
      <input {...register("password", { required: true,min: 8 }) }placeholder="password"  />
      
      <input type="submit" />
    </form>
  )
  
   
}
export default Login

