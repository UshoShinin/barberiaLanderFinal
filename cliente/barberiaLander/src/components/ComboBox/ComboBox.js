import classes from "./ComboBox.module.css";
import Opciones from "./Opciones";
import Transition from "react-transition-group/Transition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
const getObjectById = (list, id) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) return list[i];
  }
};
const ComboBox = (props) => {
  let currentData = null;
  if (props.current!==null) currentData = getObjectById(props.opciones, props.current);
  return (
    <div className={classes.ComboBox}>
      <div
        onClick={!props.disabled?props.onClick:null}
        className={`${!props.disabled?classes.select:classes.disabled} ${props.active ? classes.active : ""}`}
      >
        <div className="contenido-select">
          <h1 className={`${classes.title} ${props.active ? classes.titleActive:""}`}>{!props.disabled?currentData===null?'Ver opciones':currentData.title:'Desactivado'}</h1>
        </div>
        <FontAwesomeIcon
          className={`${classes.button} ${props.active ? classes.active : ""}`}
          icon={faAngleRight}
        />
      </div>
      <Transition mountOnEnter unmountOnExit in={props.active} timeout={300}>
        {(state) => (
          <Opciones
            height={props.height}
            mostrar={props.onChange}
            show={state}
            opciones={props.opciones}
          />
        )}
      </Transition>
    </div>
  );
};

export default ComboBox;
