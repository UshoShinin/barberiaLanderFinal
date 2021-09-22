import classes from './Opcion.module.css'
const Opcion = (props) => {
  return (
    <div className={classes.opcion} onClick={()=>{props.onClick(props.data.id)}}>
      <h1 className={classes.title}>{props.data.title}</h1>
    </div>
  );
};
export default Opcion;
