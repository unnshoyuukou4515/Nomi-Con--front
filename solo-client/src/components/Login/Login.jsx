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

      // console.log("Login response:", response);
      // console.log("User ID:", response.data.userId);
      // console.log("Username:", response.data.username);
      if (response.status === 200) {
        // console.log("Login successful with data:", response.data);
        navigate('/home', { state: { userId: response.data.userId, username: response.data.username } });
      } else {
        setLoginStatus(response.status); 
      }
    } catch (error) {
      setLoginStatus(error.response ? error.response.status : "unknown");
      let errorMessage = "An error occurred, Please try again later.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      window.alert(errorMessage);
    }
  };

  return (
    <div className="login-container">
    <h1 className='login-header'>呑みコン<span className="login-header2">~Nomi Con~</span></h1>

    <p className = "subtitle">For the "Sake" of Good Times</p>
    <form onSubmit={handleSubmit(onSubmit)} noValidate className='login-form'>
      <div className='form-group'>
        <label htmlFor='username' className='form-label'>Username</label>
        <input 
          type='text' 
          id='username' 
          className='form-input'
          {...register("username", {
            required: "Username is required."
          })} 
        />
        {errors.username && <p className='error-message'>{errors.username.message}</p>}
      </div>
      <div className='form-group'>
        <label htmlFor='password' className='form-label'>Password</label>
        <input 
          type='password'
          id='password'
          className='form-input' 
          {...register("password", {
            required: "Password is required."
          })} 
        />
        {errors.password && <p className='error-message'>{errors.password.message}</p>}
      </div> 
      <div className='form-group'>
          <label htmlFor='adultConfirmation' className='form-label'>
            <input
              type='checkbox'
              id='adultConfirmation'
              {...register("adultConfirmation", {
                required: "You must confirm you are an adult."
              })}
            />
            <span className='warning'>I confirm that I am at least 20 years old</span>
          </label>
          {errors.adultConfirmation && <p className='error-message'>{errors.adultConfirmation.message}</p>}
        </div>        
      <button type='submit' className='login-button'>Log In</button>
    </form>
    <Link to="/register"><button className='link-button register-button'>Register</button></Link>
    {loginStatus && <div className="login-status">Login status: {loginStatus}</div>}
  </div>
  );
}
