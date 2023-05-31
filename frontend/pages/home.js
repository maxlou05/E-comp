import React from 'react';
import ReactDOM from 'react-dom/client';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from '../styles/Home.module.css';

import {CircleButton, Image, Header} from './Components.js'

export default function Home() {
  return (
      <div>
        <Head>
          <title> E-Comp - Competition Host </title>
        </Head>
        <main>
          <div className={styles.container}>
              <Header/>
          </div>

          <div id="row-one" className={styles.rowOne}>
            <CircleButton
              href="/hostedEvents"
              color="#ffdda8"
              size={24}
              title="Hosted Events"
              text="Events you are hosting">
            </CircleButton>

            <CircleButton
              href="/myEvents"
              color="#ffc6c6"
              size={24}
              title="My Events"
              text="Events you are participating in">
            </CircleButton>
          </div>

          <div id="row-two" className={styles.rowTwo}>
            <CircleButton
              href="/login"
              color="#b0f5cd"
              size={28}
              title="Create Event"
              text="Create a new Event">
            </CircleButton>

            <CircleButton
              href="/joinEvent"
              color="#ffc7a8"
              size={28}
              title="Join Event"
              text="Join Event with a code">
            </CircleButton>
          </div>
        </main>
      </div>
  )
}
