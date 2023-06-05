import React from 'react';

import styles from './styles/Home.module.css';

import {Header} from './src/components/Header.js'


export const metadata = {title: 'Home | E-Comp'}
export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body>
        <div className={styles.container}>
            <Header/>
        </div>
        {children}
      </body>
    </html>
  );
}