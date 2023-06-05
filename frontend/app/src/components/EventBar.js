import Link from 'next/link';

import styles from './styles/EventBar.module.css';

import {Image} from './Image.js';
import {MyProgressBar} from './MyProgressBar.js';

export function EventBar(props){
  return(
    <Link href={`/myEvents/${props.eventID}`}
        className={styles.EventBar}
        style={{backgroundColor: props.color,
        '--h':12,
        '--w':80}}>
        <div className={styles.container}>
          <h1 className = {styles.EventBarTitle}> {props.title} </h1>
          <Image
            src={props.icon}
            alt="Event Icon"
            width = {75}
            height = {75}/>
        </div>
        <div className={styles.container}>
          <p>{props.text}</p>
          <MyProgressBar now={60}/>;
          <h3>Your Points: {props.points} </h3>
        </div>
    </Link>
  );
}