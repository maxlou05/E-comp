import React from 'react';

import Link from 'next/link';

import { cookies } from 'next/dist/client/components/headers';
import { ApiButton } from './ApiButton'

async function getData() {
    // For some stupid reason this both fetch and axios just won't send the cookie, even though the cookie exists and credentials is true
    let token
    if(cookies().get('accessToken')) token = cookies().get('accessToken').value
    const res = await fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/account`, {
        method: 'GET',
        credentials: "include",
        cache: 'no-store',  // Want this to re-fetch on every call to update
        headers: {
            Authorization: token
        }
    });
   
    // Handle errors
    if (!res.ok) {
        return "need to login"
    }
   
    return res.json();
  }

export async function LoginText(){
    
    console.log(cookies().has('accessToken'))
    console.log(cookies().get('accessToken'))
    const data = await getData()

    // If have data, that means logged in
    if(data.user){
        return(
            <div>
                <p> You are currently logged in as '{data.user}' </p>
                <ApiButton text='Logout'
                    url="/account/logout"
                    method="POST"/>
            </div>
        )
    }
    else {
        return(
            <Link href='/login'> Login </Link>
        )
    }
}