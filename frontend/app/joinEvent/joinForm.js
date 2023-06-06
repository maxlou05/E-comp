'use client';

import ReactDOM from 'react-dom/client';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

import styles from '../styles/JoinEvent.module.css';

import {CircleButton} from '../src/components/CircleButton.js'

export function JoinForm(props){
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('')
  const [EventID, setEventID] = useState('')

  async function handleLogin(e) {
    const axios = require('axios').default;
    const backend = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_HOST,
        timeout: 1000,
        withCredentials: true});

    e.preventDefault();
    try{const response = await backend.put(`/participant/join/${eventID}`);
        console.log(response);
        await backend.get('/account');
        router.push('/');
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
          Event Code:
          <input type="text" value={EventID} onChange={e => setEventID(e.target.value)} />
        </label>
        <div className={styles.break} />
        <button type="submit" className={styles.submit}>Join→ </button>
      </form>
      <div className={styles.break} />
      <p style={{color:"red"}}> {errorMessage} </p>
    </div>
  )
}