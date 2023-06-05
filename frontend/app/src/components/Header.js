import React from 'react';

import Link from 'next/link';

import styles from './styles/Header.module.css';

import {Image} from './Image.js'


export function Header(props){
  return(
    <div className={styles.Header}>
      <h1 className={styles.PageHeader}> E-Comp </h1>
      <Link href='/'>
      <Image
       src="/e-comp logo.svg"
       alt="logo"
       width={100}
       height={100}/>
       </Link>
    </div>
  )
}
