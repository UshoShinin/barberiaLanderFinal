import React, { useRef, useImperativeHandle } from "react";
import classes from "./Input.module.css";

/* El componente está envuelto en React.forwardRef para poder sumar el funcionamiento de useRef
se pasa al campo de input para que desde el forumulario sea possible hacerle focus al campo en caso de ser incalido
el componente también cambia su apariencia si a ojos del formulario este es inválido o no */

const Input = React.forwardRef((props, ref) => {
  const inputRef = useRef();
  const activate = () => {
    inputRef.current.focus();
  };
  useImperativeHandle(ref, () => {
    return { focus: activate };
  });
  return (
    <div className={classes.div}>
      <input
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
export default Input;
