import classes from './Card.module.css'

const  Card =(props)=>{
return <div className={`${classes.card} ${props.className!==undefined?props.className:''}`}>{props.children}</div> // Genera un div que envuelve lo que sea que esté dentro del componente Card con el fin de darle un borde.
}

export default Card;