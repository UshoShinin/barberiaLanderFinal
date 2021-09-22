import React from "react";
import ReactDOM from 'react-dom';
import CSSTransition from "react-transition-group/CSSTransition";
import classes from "./Modal.module.css";
import SimpleButton from "../SimpleButton/SimpleButton";
/* Variable que define el tiempo de entrada y de salida */
const animationTiming = {
  enter: 400,
  exit: 1000,
};

//Este componente es el fondo blanco detrás del modal,
const Backdrop = (props) => {
  return (
    <div onClick={props.closed}
      className={`${classes.Backdrop} ${
        props.show ? classes.BackdropOpen : classes.BackdropClose
      }`}
    ></div>
  );
};
/* Todo el camponente tiene un CSSTransition  pero realmente las propiedades que usa solo son el show, 
para saber si el div de modal debe estar entrando o nom este tambén cuenta ocn un botón el cual puede cerrar todo el modal*/

const ModalOveryLay = (props) => {
  return (
    <CSSTransition
      mountOnEnter
      unmountOnExit
      in={props.show}
      timeout={animationTiming}
      classNames={{
        enter: "",
        enterActive: classes.ModalOpen,
        exit: "",
        exitActive: classes.ModalClosed,
      }}
    >
      <div className={`${classes.Modal} ${props.className!==undefined?props.className:''}`} style={{top:`${props.tope!==undefined?props.tope:30}%`}}>
        {props.children}
        <SimpleButton type="button" action={props.closed} color={"red"}>
          X
        </SimpleButton>
      </div>
    </CSSTransition>
  );
};

const portalElement = document.getElementById('overlays')

const Modal = (props) => {
  return <>
    {ReactDOM.createPortal(<Backdrop closed={props.closed} show={props.show}/>,portalElement)}
    {ReactDOM.createPortal(<ModalOveryLay className={props.className} closed={props.closed} show={props.show} tope={props.tope}>{props.children}</ModalOveryLay>,portalElement)}
  </>;
};

export default Modal;
