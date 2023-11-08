import React, { useState, useEffect } from 'react';
import './Register.css';
import LoginForm from '../Login/Login'; 
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from "axios";

export default function RegistrationForm() {
  const [statusCode, setStatusCode] = useState(null);
  const [correctStatusCode, setCorrectStatusCode] = useState(false);

  useEffect(() => {
    if (statusCode === 201) {
      setCorrectStatusCode(true);
    }
  }, [statusCode]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
      password: "",
      email: "",
    }
  });

  const onSubmit = async (data) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const url = `${apiUrl}/createNewAccount`;
      const response = await axios.post(url, data);
      setStatusCode(response.status);
      window.alert("Account created successfully!");
    } catch (error) {
      if (error.response) {
        window.alert(error.response.data.message);
      } else {
        window.alert("An error occurred, please try again later.");
      }
    }
  };

  return (
    <>
        <h1 className='login-header'>呑みコン<span className="login-header2">~Nomi Con~</span></h1>

          <p className = "subtitle">For the "Sake" of Good Times</p>
           {!correctStatusCode ?
        <div className="register-container">
          <h1 className='register-header'>Registration</h1>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className='register-form'>
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
              <label htmlFor='email' className='form-label'>Email</label>
              <input
                type='email'
                id='email'
                className='form-input'
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email format."
                  }
                })}
              />
              {errors.email && <p className='error-message'>{errors.email.message}</p>}
            </div>

            <button type='submit' className='register-button'>Register</button>
          </form>
          <Link to="/" className='back-to-login-link'><button className='back-to-login-button'>Back To Login</button></Link>
        </div> :
        <LoginForm />
      }
    </>
  );
}
