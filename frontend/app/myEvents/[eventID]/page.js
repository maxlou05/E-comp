import React from 'react';

import Head from 'next/head';
import styles from '../../styles/EventDash.module.css';
import Link from 'next/link';

import {EventBar} from '../../src/components/EventBar.js';
import {Circle} from '../../src/components/Circle.js';
import {Table} from '../../src/components/Table.js';

const axios = require('axios').default;
    const backend = axios.create({
        baseURL: `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}`,
        timeout: 1000,
        withCredentials: true});

async function getEventActivityInfo (id) {
        try {
            const response = await backend.get(`/events/${id}`)
            console.log(response)
            return response.data
        } catch (err) {
            console.log(err)
            return null
        }
}

export default async function EventDash(props){
  const eventMetadata = await getEventActivityInfo(props.params.eventID)
  return(
    <div className={styles.container}>
      <EventBar
        eventID={props.params.eventID}
        color="#b0f5cd"
        title="Event Title"
        text={Date("05/05/23").toString()}
        points= {1000}
        icon="e-comp logo.svg"/>

      <div className={styles.rowOne}>
        <Circle
          size={20}
          title="My Points"
          text="167"
          color="#ffc7a8"/>

        <Circle
          size={20}
          title="Event Description"
          text="abcdefg"
          color="#ffc7a8"/>

        <Circle
          size={20}
          title="Submit Response"
          text="Record your activity"
          color="#ffc7a8"/>
      </div>

      <div className={styles.rowTwo}>
      <Circle
        size={45}
        title="My Stats"
        text="DATA GRID"
        color="#ffc7a8"/>

      <Circle
        size={45}
        title="LeaderBoards"
        text="DATA GRID"
        color="#ffc7a8"/>

      <Table/>
      </div>
    </div>
  )
}