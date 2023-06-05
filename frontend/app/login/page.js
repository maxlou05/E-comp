import React from 'react';

import styles from '../styles/Login.module.css';

import {CircleButton} from '../src/components/CircleButton.js';
import {LoginForm} from './loginForm.js';

function LoginCircle(props){
  return(
  <div className={styles.popup}>
    <h2>{props.title} </h2>
    <LoginForm/>
  </div>
  )
}


export default function Login(props) {
   return (
   <div>
    <div className={styles.popup}>
    </div>
     <LoginCircle
      title="Login"/>
   </div>
   );
}

