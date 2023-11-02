import React, { useEffect, useState } from 'react';
import './LoginForm.css'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Homepage from './homepage';
import { createContext } from 'react';

export let playerInfo = createContext();
export let username = createContext();


export default function LoginForm() {
    const [playerId, setPlayerId] = useState(null)
    const [statusCode, setStatusCode] = useState(null);
    const [correctStatusCode, setCorrectStatusCode] = useState(false);
    const [playerUsername, setPlayerUsername] = useState(null)

     playerInfo = createContext(playerId);
     username = createContext(playerUsername)

    useEffect(() => {
        if(statusCode === 200){
          setCorrectStatusCode(true);
        }       
      
    }, [statusCode])


    const form = useForm({
        defaultValues: {
            username: "",
            password: ""
        }
    });

    const { register, control, handleSubmit, formState } = form;
    const { errors } = formState;

    const onSubmit = async (data) => {
        const url = "https://pokedictionarygamedev.onrender.com/login";
        const returnedData = await axios.post(url, data).catch(error => {
            window.alert(error.response.data)});
        if(returnedData){
            setStatusCode(returnedData.status);
            setPlayerId(returnedData.data.accountID)
            setPlayerUsername(returnedData.data.username);
        }            
    }

    return (  
       <>
        {!correctStatusCode ?
        <div>
          
            <h1 className='loginHeader'>Login Form</h1>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className='form-control'>
                    <label htmlFor='username'>Username</label>
                    <input 
                        type='text' 
                        id='username' 
                        {...register("username", {
                            required: {
                                value: true,
                                message: "Username is required."
                            }
                        })} 
                    />
                    <p className='error'>{errors.username?.message}</p>
                </div>
                <div className='form-control'>
                    <label htmlFor='password'>Password</label>
                    <input 
                        type='text' 
                        id='password' 
                        {...register("password", {
                            required: {
                                value: true,
                                message: "Password is required."
                            }
                        })} 
                    />
                    <p className='error'>{errors.password?.message}</p>
                </div>         
                <button className='link 'type='submit'>Log In</button>
            </form>
            <Link to="registration"><button  className='link' >Register</button></Link>
        </div>:
        <Homepage playerId={playerId}/> }
        </>
    );
}; 