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
        title="Merivale Annual Eating Contest !!"
        points= {0}
        icon= '/Hotdog.png'
        startDate = "2024-05-18T00:00:00"
        endDate= "2024-05-20T00:00:00"/>
      <div className={styles.rowOne}>
        <Circle
          size={20}
          title="My Points"
          text="0"
          color="#ffc7a8"/>

        <Circle
          size={20}
          title="Event Description"
          text="The Merivale Annual Eating Contest"
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
        text=""
        color="#ffc7a8">
        <Table
          rows = {[
               { id: 1, col1:'Hotdogs Eaten' , col2: 0, col3: 0, col4:251},
               { id: 2, col1: 'Burgers Eaten', col2: 0, col3: 0 , col4:8 }
             ]}
          columns =  {[
                    { field: 'col1', headerName: 'Activity', width: 150 },
                    { field: 'col2', headerName: 'Amount', width: 150 },
                    { field: 'col3', headerName: 'Points', width: 150 }
                  ]}
        />
        </Circle>

      <Circle
        size={45}
        title="Leaderboards"
        text=""
        color="#ffc7a8">
         <Table
          rows = {[
               { id: 1, col1: 'Harry', col2: 101, col3: 150, col4:251},
               { id: 2, col1: 'Justin', col2: 5, col3: 3 , col4:8 },
               { id: 3, col1: 'Kevin', col2: 1, col3: 8, col4:9  },
               { id: 4, col1: 'Maxwell', col2: 0, col3: 0, col4:0 }
             ]}
          columns =  {[
                    { field: 'col1', headerName: 'Name', width: 150 },
                    { field: 'col2', headerName: 'Hotdogs Eaten', width: 150 },
                    { field: 'col3', headerName: 'Burgers Eaten', width: 150 },
                    { field: 'col4', headerName: 'Total Score', width: 150 }
                  ]}
        />
      </Circle>

      </div>
    </div>
  )
}