import React from 'react';

import styles from '../styles/JoinEvent.module.css';

import {CircleButton} from '../src/components/CircleButton.js';
import {JoinForm} from './joinForm.js';

function JoinCircle(props){
  return(
  <div className={styles.popup}>
    <h2>{props.title} </h2>
    <JoinForm/>
  </div>
  )
}


export default function JoinEvent(props) {
   return (
   <div>
    <div className={styles.popup}>
    </div>
     <JoinCircle
      title="Join"/>
   </div>
   );
}