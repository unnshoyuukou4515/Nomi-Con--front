import React, { useState, useEffect } from 'react';
import './Login.css';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginForm() {
  const [loginStatus, setLoginStatus] = useState(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const response = await axios.post(`${apiUrl}/login`, data);

      console.log("Login response:", response);

      // userId と username を個別に出力します
      console.log("User ID:", response.data.userId);
      console.log("Username:", response.data.username);


      if (response.status === 200) {
        console.log("Login successful with data:", response.data);
        // レスポンスからユーザー情報をセットし、Homeコンポーネントへリダイレクトする
        navigate('/home', { state: { userId: response.data.userId, username: response.data.username } });
      } else {
        setLoginStatus(response.status); // ログイン状態をセットして、適切にハンドルできるようにする
      }
    } catch (error) {
      setLoginStatus(error.response ? error.response.status : "unknown");
      let errorMessage = "An error occurred, please try again later.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      window.alert(errorMessage);
    }
  };

  return (
    <div>
      <h1 className='loginHeader'>Login Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className='form-control'>
          <label htmlFor='username'>Username</label>
          <input 
            type='text' 
            id='username' 
            {...register("username", {
              required: "Username is required."
            })} 
          />
          {errors.username && <p className='error'>{errors.username.message}</p>}
        </div>
        <div className='form-control'>
          <label htmlFor='password'>Password</label>
          <input 
            type='password'
            id='password' 
            {...register("password", {
              required: "Password is required."
            })} 
          />
          {errors.password && <p className='error'>{errors.password.message}</p>}
        </div>         
        <button type='submit'>Log In</button>
      </form>
      <Link to="/register"><button className='link'>Register</button></Link>
    </div>
  );
}
