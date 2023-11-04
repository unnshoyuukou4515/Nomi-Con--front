import React, { useState, useEffect } from 'react';
import './Register.css';
import LoginForm from '../Login/Login'; // 'Login'フォルダ内の'LoginForm.jsx'からインポート
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
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
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
      {!correctStatusCode ?
        <div>
          <h1 className='loginHeader'>Registration Form</h1>
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
              <p className='error'>{errors.username?.message}</p>
            </div>

            <div className='form-control'>
              <label htmlFor='password'>Password</label>
              <input
                type='password' // Changed to type 'password' to hide input
                id='password'
                {...register("password", {
                  required: "Password is required."
                })}
              />
              <p className='error'>{errors.password?.message}</p>
            </div>

            <div className='form-control'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                id='email'
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email format."
                  }
                })}
              />
              <p className='error'>{errors.email?.message}</p>
            </div>

            <button type='submit'>Register</button>
          </form>
          <Link className="link" to="/"><button>Back To Login</button></Link>
        </div> :


        <LoginForm />
      }
    </>
  );
}
