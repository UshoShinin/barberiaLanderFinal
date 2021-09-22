import classes from "./Button.module.css";
const Button = (props) => {
  //Junta las classes de botón con una posible clase extra con el fin de cambiar el color del boton a rojo de ser necesario
    let classesButton;
    if (!props.disabled) {
      switch (props.color) {
        case "red":
          classesButton = ` ${props.className} ${classes.button} ${classes.red}`;
          break;
        case "white":
          classesButton = ` ${props.className} ${classes.button} ${classes.white}`;
          break;
        default:
          classesButton = ` ${props.className} ${classes.button}`;
          break;
      }
    }else{
      classesButton=`${props.className} ${classes.disabled}`;
    }
  return (
    <button
      disabled={props.disabled}
      type={props.type || "button"} //Si el tipo no es especificado será automaticamente button
      onClick={props.action} // Se le pasa al acción asosciada del onClick a este botón
      className={classesButton}
    >
      {
        props.children /* Lo que sea que esté dentro del del etiqueta Button entrará dentro del botón  */
      }
    </button>
  );
};
export default Button;
