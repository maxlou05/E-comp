import styles from './styles/Image.module.css';

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