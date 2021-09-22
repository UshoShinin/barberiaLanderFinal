import React, { useRef, useImperativeHandle } from "react";
import classes from "./TextArea.module.css";

/* Este componente tiene el objetivo de servir como un campo de descripción o donde el usuario necesite escribir mucho
Está envuelto en React.forwardRef para poder hacerle focus en caso de ser necesario, pero normalmente no lo es
La apariencia del campo cambia en caso de ser válido o no y eso lo decide el formulario*/


const TextArea = React.forwardRef((props, ref) => {
  const inputRef = useRef();
  const activate = () => {
    inputRef.current.focus();
  };
  useImperativeHandle(ref, () => {
    return { focus: activate };
  });
  return (
    <div className={classes.div}>
      <textarea
        ref={inputRef}
        {...props.input}
        className={`${classes.input} ${
          props.isValid === false
            ? classes.invalid
            :(props.isValid === true)
            ? classes.valid
            : ""
        }`}
      />
    </div>
  );
});
export default TextArea;
