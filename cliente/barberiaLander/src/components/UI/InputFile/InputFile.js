import classes from "./InputFile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPlus } from "@fortawesome/free-solid-svg-icons";

/* Este componente no utiliza el input directamente, la interacción con el usuario se realiza a travéz del label pero
el input es el que guarda el dato, también se le manda una propiedad label con la cual le muesta al componente que 
texto debe mostrar */

const Input = (props) => {
  return (
    <div className={classes.div}>
      <label className={classes.label} htmlFor={props.input.id}>
        <div className={classes.icons}>
          <FontAwesomeIcon className={classes.icon} icon={faImage} />
          <FontAwesomeIcon className={classes.plus} icon={faPlus} />
        </div>
        {props.label}
      </label>
      <input
        type="file"
        {...props.input}
        className={classes.file}
        accept="image/*"
      />
    </div>
  );
};
export default Input;
