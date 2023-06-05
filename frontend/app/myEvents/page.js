'use client';
import React from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import ProgressBar from '../../node_modules/react-bootstrap/ProgressBar';

import styles from '../styles/MyEvents.module.css';

import {Header} from '../src/components/Header.js'
import {CircleButton} from '../src/components/CircleButton.js'
import {EventBar} from '../src/components/EventBar.js'
import {MyProgressBar} from '../src/components/MyProgressBar.js'


async function PostTestEvent(){
  const eventResponse = await backend.put('/host',{
                      "name": "Eating contest",
                      "start": "2024-05-18T00:00:00",
                       "end": "2024-05-20T00:00:00",
                       "teamSize": 2,
                        "public": true})

  const activitySetResponse = await backend.put('/host/' + eventResponse.id + '/edit/activitySets',{
                            name: "Hotdog race" ,
                            start: "2024-05-18T00:00:00",
                            end: "2024-05-20T00:00:00",
                            maxSubmissions: 1})

  const activityResponse = await backend.put ('/host/' + eventResponse.id + '/edit/activitySets'+ activitySetResponse.id + '/activities', {
                          "name": "fav food",
                          "description": "what's ur fav food",
                          "inputType": "str",
                          "gradingType": "answer",
                          "answers": ["hamburger"],
                          "pointValue": 5})
  await backend.put('/host/' + eventResponse.id +'/publish')

  //participant/join/[eventID]
  }

//PostTestEvent();


//  const UserEventData = await backend.get('/participant/events')
//  return(
//    <div className={styles.grid}>
//      {EventBarList}
//    </div>
//  )

//function MapEventBar(data){
//  return(
//    <div>
//    {const EventBarList = UserEventData.map((i)=>
//    <EventBar
//      eventID = {i.event.id}
//      color="#b0f5cd"
//      title= {i.event.name}
//      icon='/e-comp logo.svg'
//      text={Date("05/05/23").toString() + "-" + event.end.toString()/>
//  )
//}

//<EventBar
//                color="#b0f5cd"
//                title="Event Title"
//                text="Event Description Event Description Event Description Event Description"
//                startDate = {Date(5/5/2023)}
//                endDate = {Date(6/30/2023)}
//                points= {1000}
//                icon="e-comp logo.svg"
//                link='/'/>

export default function MyEvents(UserEventData) {
  const eventList =
  [
    {id: 1,
    event: {
      id: 1 ,
      name: 'Eating Contest',
      icon: null,
      start: "2024-05-18T00:00:00",
      end: "2024-05-20T00:00:00",
      result: null
      }
    }
  ]
  return (
    <div className={styles.container}>
      <Head>
        <title> E-Comp - My Events</title>
      </Head>
        <div id="eventsList" className={styles.grid}>
          <ProgressBar now={60} label={`${60}%`}/>
          {eventList.map((i)=> (
              <EventBar
                eventID = {i.event.id}
                color="#b0f5cd"
                title= {i.event.name}
                icon='/e-comp logo.svg'
                text={i.event.start.toString() + "-" + i.event.end.toString()}/>
               ))}
        </div>
    </div>
  )
}