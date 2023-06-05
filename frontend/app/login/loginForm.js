'use client';

import ReactDOM from 'react-dom/client';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

import styles from '../styles/Login.module.css';

import {CircleButton} from '../src/components/CircleButton.js'


const axios = require('axios').default;
const backend = axios.create({
    baseURL: process.env.BACKEND_HOST,
    timeout: 1000,
    withCredentials: true});

export function LoginForm(props){
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e) {
    e.preventDefault();
    try{const {response} = await backend.post('/account/login',{username:username, password:password});
        console.log("11111");
        router.push('/home');
        }
    catch(err) {
      console.log("error");
      console.log(err)
      setErrorMessage(err.response.data.error)
    }
  }
  return(
  <div>
  <form onSubmit={handleLogin}>
  <label className={styles.TextField}>
    Username:
    <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
  </label>
  <label className={styles.TextField}>
      Password:
      <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
  </label>
  <div className={styles.break} />
    <button type="submit" className={styles.submit}>Login→ </button>
   </form>
      <button className={styles.CreateAccount} onClick={()=>router.push('/createAccount')}> Create a new account </button>
   <div className={styles.break} />
   <p style={{color:"red"}}> {errorMessage} </p>
   </div>
  )
}