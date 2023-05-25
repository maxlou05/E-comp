import React from 'react';
import ReactDOM from 'react-dom/client';

import Head from 'next/head';
import Link from 'next/link';

import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title> E-Comp - Competition Host</title>
      </Head>

      <main>
        <div className={styles.container1}>
            <h1 className={styles.title}>E-Comp</h1>
            <img src="e-comp logo.svg" alt="logo" width="144" height="144"/>
        </div>

        <div id="row-one" className={styles.grid}>
          <a id="hosted-events" href="/hostedEvents" className={styles.card}>
            <h3>Hosted Event</h3>
            <p>Manage the Events you are hosting</p>
          </a>

          <a id="my-events" href="/myEvents" MyEvents className={styles.card}>
            <h3>My Events</h3>
            <p>See events you are participating in</p>
          </a>
        </div>

        <div id="row-two" className={styles.grid}>
          <a id="create-event" href="https://github.com/vercel/next.js/tree/master/examples" className={styles.card}>
            <h3>Create Event</h3>
            <p>Create a new Event</p>
          </a>

          <a id="join-events" href="/hostedEvents" className={styles.card}>
            <h3>Join Events</h3>
            <p>Join an Event with a code</p>
          </a>
        </div>
      </main>

      <footer>
        <p>e-comp 2023</p>
      </footer>
    </div>
  )
}
