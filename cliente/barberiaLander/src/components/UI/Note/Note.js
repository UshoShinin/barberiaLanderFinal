import CSSTransition from "react-transition-group/CSSTransition";
import classes from "./Note.module.css";
const Note = (props) => {
  return (
    <CSSTransition
      mountOnEnter
      unmountOnExit
      in={props.show}
      timeout={160}
      onEnter={() => {
        setTimeout(props.onClose, 3000);
      }}
      classNames={{
        enter: ``,
        enterActive: `${classes.NoteOpen}`,
        exit: "",
        exitActive: `${classes.NoteClose}`,
      }}
    >
      <div className={classes.Note}>
        <div className={classes.text}>
          <p>{props.children}</p>
        </div>
        <div className={classes.LoadingBar}>
          <span
            className={`${classes.Bar} ${props.show ? classes.BarClose : ""}`}
          ></span>
        </div>
      </div>
    </CSSTransition>
  );
};
export default Note;
