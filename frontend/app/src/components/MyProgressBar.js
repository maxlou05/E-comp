'use client';
import ProgressBar from '../../../node_modules/react-bootstrap/ProgressBar';

import styles from './styles/ProgressBar.module.css';


export function MyProgressBar(props) {
  const now = props.now;
  return(
    <div>
      <ProgressBar className = {styles.ProgressBar} now={now} label={`${now}%`}>
      </ProgressBar>
    </div>
  )
}

