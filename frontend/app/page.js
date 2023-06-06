import React from 'react';

import styles from './styles/Home.module.css';

import {CircleButton} from './src/components/CircleButton.js'
import {Image} from './src/components/Image.js'

// Home page component
export default function Home() {
  return (
      <div>
{/*Row one of 2 buttons*/}
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
{/*Row two of 2 buttons*/}
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
              link='/joinEvent'/>
          </div>
      </div>
  )
}
