import React from 'react';
import ReactDOM from 'react-dom/client';

import Head from 'next/head';
import styles from '../styles/MyEvents.module.css';
import Link from 'next/link';

import {CircleButton, Image, Header, Progress} from './Components.js'

export function EventBar(props){
return(
    <a
      className={styles.EventBar}
      style={{backgroundColor: props.color,
      '--h':12,
      '--w':80}}>
      <div className={styles.container}>
        <h1 className = {styles.EventBarTitle}> {props.title} </h1>
        <Image
          src={props.icon}
          alt="Event Icon"
          width = {75}
          height = {75}
         />
      </div>
      <div className={styles.container}>
        <p>{props.text}</p>
        <Progress now={60} label={`${60}%`} variant="variant"/>;
        <h3>Your Points: {props.points} </h3>
      </div>
    </a>
  );
}

async function MapEventBar(data){
  const UserEventData = await backend.get('/participant/events')
  const EventBarList = UserEventData.map((i)=>
    <EventBar
      color="#b0f5cd"
      title={event.name}
      icon='/e-comp logo.svg'
      text={Date("05/05/23").toString() + "-" + event.end.toString()}
    />
  )
  return(
    <div className={styles.grid}>
      {EventBarList}
    </div>
  )

//    const EventData = UserEventData.map((EventData) => eventIcon(EventData));
//      return (
//        <ul>{EventData}</ul>
//      )
}

export default function MyEvents(UserEventData) {
  return (
    <div className={styles.container}>
      <Head>
        <title> E-Comp - My Events</title>
      </Head>

      <main>
        <div className={styles.container}>
          <Header/>
        </div>

        <div id="eventsList" className={styles.grid}>
          <EventBar
                color="#b0f5cd"
                title="Event Title"
                text="Event Description Event Description Event Description Event Description"
                startDate = {Date(5/5/2023)}
                endDate = {Date(6/30/2023)}
                points= {1000}
                icon="e-comp logo.svg"/>
//          <script type="text/javascript">
//            MapEventBar(UserEventData)
//          </script>
        </div>
      </main>
    </div>
  )
}