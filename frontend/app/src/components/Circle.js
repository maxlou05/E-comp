import styles from './styles/Circle.module.css';
import Link from 'next/link';

export function Circle(props){
  return(
    <a
      className={styles.Circle}
      style={{backgroundColor: props.color,
          '--d':props.size}}>
      <h1>{props.title}</h1>
      <p>{props.text}</p>
    </a>
  );
 }