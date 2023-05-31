import React from 'react';
import ReactDOM from 'react-dom/client';

import Head from 'next/head';
import Link from 'next/link';

import styles from '../styles/Components.module.css';
//import { DataGrid } from '../node_modules/@mui/x-data-grid';

//https://react-bootstrap.github.io/components/progress/
import ProgressBar from '../node_modules/react-bootstrap/ProgressBar';


export function Progress(props) {
  const now = props.now;
  return <ProgressBar className = {styles.ProgressBar} now={now} label={`${now}%`} variant="info"/>;
}

export function CircleButton(props){
  return(
    <a
      className={styles.CircleButton}
      href={props.href}
      style={{backgroundColor: props.color,
          '--d':props.size}}>
      <h1>{props.title}</h1>
      <p>{props.text}</p>
    </a>
  );
 }

export function Image(props) {
   return (
     <img
       className="Image"
       src={props.src}
       alt={props.alt}
       width={props.width}
       height={props.height}
     />
   );
 }

export function Header(props){
  return(
    <div className={styles.Header}>
      <h1 className={styles.PageHeader}> E-Comp </h1>
      <Image
       src="/e-comp logo.svg"
       alt="logo"
       width={100}
       height={100}/>
    </div>
  )
}
