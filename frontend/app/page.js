import React from 'react';

import styles from './styles/Home.module.css';

import {CircleButton} from './src/components/CircleButton.js'
import {Image} from './src/components/Image.js'
import {MyProgressBar} from './src/components/MyProgressBar.js'

export default function Home() {
  return (
      <div>
          <div id="row-one" className={styles.rowOne}>
            <p className={styles.test}> Hello </p>
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
