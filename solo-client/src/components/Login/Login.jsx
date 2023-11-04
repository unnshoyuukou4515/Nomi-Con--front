import React, { useState, useEffect } from 'react';
import './Login.css';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginForm() {
  const [loginStatus, setLoginStatus] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

  // 認証状態がtrueに変更されたときに実行されるuseEffect
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home'); // isAuthenticatedがtrueの時にホームページにリダイレクトする
    }
  }, [isAuthenticated, navigate]); // 依存配列にnavigateとisAuthenticatedを含める

  useEffect(() => {
    if (loginStatus === 200) {
      setIsAuthenticated(true);
    }
  }, [loginStatus]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // 環境変数からAPIエンドポイントを取得してログインエンドポイントのURLを構築
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";// デフォルトURLを提供
      const url = `${apiUrl}/login`;
      const response = await axios.post(url, data);
      setLoginStatus(response.status);
      setUserInfo({
        userId: response.data.userId,
        username: response.data.username
      });
    } catch (error) {
      if (error.response) {
        window.alert(error.response.data.message); // エラーメッセージを適切に表示
        setLoginStatus(error.response.status);
      } else {
        window.alert("An error occurred, please try again later.");
      }
    }            
  };

  return (
    <>
      {!isAuthenticated ? (
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
      ) : (
        // 認証済みの状態であれば、ログインフォームを表示せず、useEffectによるリダイレクトを待つ
        <p>Redirecting to home...</p>
      )}
    </>
  );
}
