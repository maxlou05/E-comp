
import React from 'react';

import Link from 'next/link';

import styles from './styles/LoginText.module.css';

//async function getLogin(){
//    const axios = require('axios').default;
//          const backend = axios.create({
//              baseURL: process.env.NEXT_PUBLIC_BACKEND_HOST,
//              timeout: 1000,
//              withCredentials: true});
//
//    const Response = await backend.get('/account');
//    return(Response)
//}

export async function LoginText(){
    console.log("before axios");
    const axios = require('axios').default;
      const backend = axios.create({
          baseURL: process.env.NEXT_PUBLIC_BACKEND_HOST,
          timeout: 1000,
          withCredentials: true});

    console.log("before response");

    const Response = await axios.get('http://localhost:6969/account');

    console.log("after response");

    if (Response.data.user){
        return(
        <div>
            <p> You are current logged in as: {Response.data.user} </p>
        </div>
        )
    } else {
        return(
        <div>
            <Link href='/login'> You are currently not logged in. Click here to Login </Link>
        </div>
        )
    }
}