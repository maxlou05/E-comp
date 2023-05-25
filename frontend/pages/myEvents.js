import React from 'react';
import ReactDOM from 'react-dom/client';

import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

import {eventIcon} from './EventIcon.js';



export default function MyEvents() {
  return (
    <div className={styles.container}>
      <Head>
        <title> E-Comp - My Events</title>
      </Head>

      <main>
        <div className={styles.container1}>
          <h1 className={styles.title}>E-Comp</h1>
          <img src="e-comp logo.svg" alt="logo" width="144" height="144"/>
        </div>

        <div id="eventsList" className={styles.grid}>
          <script type="text/javascript">
          </script>
        </div>
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

        #eventsList {
          flex-direction:column
         }
      `}</style>
    </div>
  )
}