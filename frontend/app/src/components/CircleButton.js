import React from 'react';

import styles from './styles/CircleButton.module.css';
import Link from 'next/link';

export function CircleButton(props){
  console.log("Click CLICK CLICK")
  return(
    <Link href={props.link}
      className={styles.CircleButton}
      style={{backgroundColor: props.color,
          '--d':props.size}}>
      <h1>{props.title}</h1>
      <p>{props.text}</p>
    </Link>
  );
 }