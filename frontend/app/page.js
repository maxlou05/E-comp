import React from 'react';

import styles from './styles/Home.module.css';

import {CircleButton} from './src/components/CircleButton.js'
import {Image} from './src/components/Image.js'
import {MyProgressBar} from './src/components/MyProgressBar.js'



async function getData() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1/');
  // The return value is not serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest error.js Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function Home() {
  const data = await getData()
  console.log(data)
  return (
      <div>
          <div id="row-one" className={styles.rowOne}>
            <CircleButton
              color="#ffdda8"
              size={24}
              title="Hosted Events"
              text="Events you are hosting"
              link='/'/>

            <CircleButton
              color="#ffc6c6"
              size={24}
              title="My Events"
              text="Events you are participating in"
              link='/myEvents'/>

          </div>

          <div id="row-two" className={styles.rowTwo}>
            <CircleButton
              color="#b0f5cd"
              size={28}
              title="Create Event"
              text="Create a new Event"
              link='/'/>

            <CircleButton
              href="/joinEvent"
              color="#ffc7a8"
              size={28}
              title="Join Event"
              text="Join Event with a code"
              link='/'/>
          </div>
      </div>
  )
}
