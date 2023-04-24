import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function MyEvents() {
  return (
    <div className={styles.container}>
      <Head>
        <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>
        <title>E-Comp - Competition Host</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          MyEvents
        </h1>
      </main>
  )
}