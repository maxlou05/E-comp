'use client';
import ReactDOM from 'react-dom/client';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

import styles from '../styles/Login.module.css';

export function CreationForm(){
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')

  async function handleCreation(e){
    console.log("#####################!!!!!!!!@@@@@@@@@@@@")
    console.log(process.env)
    const axios = require('axios').default;
    const backend = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_HOST,
        timeout: 1000,
        withCredentials: true});

    e.preventDefault()
    console.log(newUsername, newPassword)
    try{const response = await backend.put('/account',{username:newUsername, password:newPassword});
        console.log(response);
        router.push('/login');
        }
    catch(err) {
      console.log("error");
      console.log(err);
      setErrorMessage(err.response.data.error);
    }
  }

  return (
    <div>
     <form onSubmit={handleCreation}>
     <label className={styles.TextField}>
       Username:
       <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
     </label>
     <label className={styles.TextField}>
         Password:
         <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
     </label>
     <div className={styles.break} />
       <button type="submit" className={styles.submit}>Create→ </button>
      </form>
      <div className={styles.break} />
      <p style={{color:"red"}}> {errorMessage} </p>
      </div>
     )
}