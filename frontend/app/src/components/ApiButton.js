"use client";

import { cookies } from 'next/dist/client/components/headers';
import { Link } from 'react-router-dom';
import { useRouter } from 'next/navigation';

export function ApiButton(props) {
    const router = useRouter()
    return(
        <button onClick={async function() {
            const axios = require('axios').default;
            const backend = axios.create({
                baseURL: `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}`,
                timeout: 1000,
                withCredentials: true});
                try {
                    const response = await backend.request({
                        url: props.url,
                        method: props.method,
                        data: props.data
                    })
                    console.log(response)
                } catch (err) {
                    console.log(err)
                }
            router.push('/login')
            router.refresh()
        }}>
            {props.text}
        </button>
    )
}