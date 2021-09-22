import classes from "./Checkbox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
const Checkbox = (props) => {
  //Es realmente un div con un propiedad onClick para que el usuario peuda interactuar
  //Verifica si ya estaba activado o no. como Tick uso FontAwesoma
  let  classesCheck;
  if(!props.disabled){
    classesCheck = `${classes.checkbox} ${props.checked?classes.active:''}`;
  }else{
    classesCheck = `${classes.disabled}`;
  }

  return (
    <div disabled={props.disabled} onClick={!props.disabled?props.onChange:null} className={classesCheck}>
      <FontAwesomeIcon icon={faCheck} className={classes.icon}/>
    </div>
  );
};
export default Checkbox;
