import classes from './NormalCard.module.css'

const NormalCard =(props)=>{
return <div className={`${classes.card} ${props.className!==undefined?props.className:''}`}>{props.children}</div> // Genera un div que envuelve lo que sea que esté dentro del componente Card con el fin de darle un borde.
}

export default NormalCard;