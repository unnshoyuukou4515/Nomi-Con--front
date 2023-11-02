import React, { useState, useEffect } from 'react';
import './RegistrationForm.css'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from "axios";
import LoginForm from './LoginForm';


export default function RegistrationForm () {
    const [statusCode, setStatusCode] = useState(null);
    const [correctStatusCode, setCorrectStatusCode] = useState(false);


    useEffect(() => {
        if(statusCode === 201){
          setCorrectStatusCode(true);
        }       
    }, [statusCode])

    const form = useForm({
        defaultValues: {
            username: "",
            password: "",
            email: "",
            firstName: "",
            lastName: ""
        }
    });

    const { register, control, handleSubmit, formState } = form;
    const { errors } = formState;

    const onSubmit = async (data) => {
        console.log(data)
        // const url = "https://pokedictionarygamedev.onrender.com/createNewAccount";
        const returnedData = await axios.post(url, data).catch(error => {
            window.alert(error.response.data);
        });
        
        

        if(returnedData){
            setStatusCode(returnedData.status);
            window.alert(returnedData.data)
        }
    }

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

                <div className='form-control'>
                    <label htmlFor='firstName'>First Name</label>
                    <input 
                        type='text' 
                        id='firstName' 
                        {...register("firstName", {
                            required: {
                                value: true,
                                message: "First name is required."
                            }
                        })} 
                    />
                    <p className='error'>{errors.first_name?.message}</p>
                </div>

                <div className='form-control'>
                    <label htmlFor='lastName'>Last Name</label>
                    <input 
                        type='text' 
                        id='lastName' 
                        {...register("lastName", {
                            required: {
                                value: true,
                                message: "Last name is required."
                            }
                        })} 
                    />
                    <p className='error'>{errors.last_name?.message}</p>
                </div>

                <button type='submit'>Register</button>
            </form>
            <Link className="link "to="/"><button>Back To Login</button></Link>
            </div> :

            <LoginForm/>}

        </>
    );
};