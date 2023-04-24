import Head from 'next/head';
import styles from '../styles/Home.module.css';
Import MyEvents

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>
        <title>E-Comp - Competition Host</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          E-Comp
        </h1>

        <p className={styles.description}>
         Online Competition Host
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Create Event &rarr;</h3>
            <p>Create and host your own competition</p>
          </a>

          <button onclick="MyEvents()" className={styles.card}>
            <script src="myEvents.js"></script>
            <h3>My Events &rarr;</h3>
            <p>See events you are participating in</p>
          </button>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Join Event &rarr;</h3>
            <p>Use an event code to join an event</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Hosted Events &rarr;</h3>
            <p>Manage the Events you have created</p>
          </a>
        </div>
      </main>

      <footer>
        <p>e-comp</p>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          background-color: lightblue;
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
