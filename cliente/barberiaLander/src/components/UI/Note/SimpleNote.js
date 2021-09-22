import CSSTransition from "react-transition-group/CSSTransition";
import SimpleButton from "../SimpleButton/SimpleButton";
import classes from "./SimpleNote.module.css";
const SimpleNote = (props) => {
  return (
    <CSSTransition
      mountOnEnter
      unmountOnExit
      in={props.show}
      timeout={160}
      classNames={{
        enter: ``,
        enterActive: `${classes.NoteOpen}`,
        exit: "",
        exitActive: `${classes.NoteClose}`,
      }}
    >
      <div className={classes.Note}>
        <h3>{props.children}</h3>
        <div>
            <div><SimpleButton action={props.aceptar}>Si</SimpleButton></div>
            <div><SimpleButton action={props.rechazar} color="red">No</SimpleButton></div>          
        </div>
      </div>
    </CSSTransition>
  );
};
export default SimpleNote;
