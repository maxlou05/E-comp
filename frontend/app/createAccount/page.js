import React from 'react';

import styles from '../styles/Login.module.css';
import {CreationForm} from './creationForm.js';

function CreationCircle(props){
  return(
  <div className={styles.popup}>
    <h2>{props.title} </h2>
    <CreationForm/>
  </div>
  )
}

export default function CreateAccount(props) {
   return (
     <CreationCircle
      title="Create an Account"/>
   );
}



