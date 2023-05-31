import React from 'react';
import ReactDOM from 'react-dom/client';

import Head from 'next/head';
import styles from '../styles/eventDash.module.css';
import Link from 'next/link';


import {EventBar} from './myEvents.js';
import {CircleButton} from './Components.js';


//const EventData =await backend.get(/events/[**eventID**])

export default function EventDash(){
  return(
    <div>
      <EventBar
        color="#b0f5cd"
        title="Event Title"
        text={Date("05/05/23").toString()}
        points= {1000}
        icon="e-comp logo.svg"/>

      <div className={styles.rowOne}>
        <CircleButton
          size={20}
          title="My Points"
          text="167"
          color="#ffc7a8"/>

        <CircleButton
          size={20}
          title="Event Description"
          text="abcdefg"
          color="#ffc7a8"/>

        <CircleButton
          size={20}
          title="Submit Response"
          text="Record your activity"
          color="#ffc7a8"/>
      </div>

      <div className={styles.rowTwo}>
      <CircleButton
        size={20}
        title="My Stats"
        text="DATA GRID"
        color="#ffc7a8"/>

      <CircleButton
        size={20}
        title="LeaderBoards"
        text="DATA GRID"
        color="#ffc7a8"/>

      </div>
    </div>
  )
}