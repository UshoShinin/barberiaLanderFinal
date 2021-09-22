import classes from "./Calendario.module.css";
import Mes from "./Mes";
import Fotos from "./Fotos";
import React from 'react';
import { useState } from "react";
import { days } from "./ContenidoCalendario/ContenidoCalendario";
import {extraerFotos} from './FuncionesAuxiliares';
const Calendario = (props) => { 
  const [currentCalendar, setCurrentCalendar] = useState(0); //Se utiliza para gestionar el mes
  const empleadosFotos = JSON.stringify(extraerFotos(props.empleados)); /* De la lista de empleados se extraen solo las fotos para mandar
  solo los nombres ci y fotos */
  // Como no tenemos todo pronto en la base de datos voya tener que armar unos tiempos y servicios y tiempos provicionales
  const move = document.getElementById("root").clientWidth>1400?23.66:19;
  const obtenerHorarios = (horarios) =>{
    props.getHorarios(horarios);
  }
  const lostFocus =()=>{
    const element = document.getElementById('Calendario');
    if(element.classList[1]!==undefined) element.classList.remove(element.classList[1]);
    
  }
  /* Necesito comentar esta funcion */
  const { cantidadMeses, content } = days(props.date,props.diasAMostrar,props.actividad,obtenerHorarios,lostFocus);
  const prevCalendar = () => {
    if (currentCalendar > 0) {
      setCurrentCalendar((state) => state - 1);
    }
  };
  const nextCalendar = () => {
    if (currentCalendar < cantidadMeses-1) {
      setCurrentCalendar((state) => state + 1);
    }
  };
  return (
    <div className={classes.container} tabIndex={-1} id="Calendario">
      <Fotos fotos={empleadosFotos}  currentEmployee = {props.currentEmployee} changeEmployee = {props.changeEmployee} onClick={props.onClick} active={props.comboEmployeeActive} />
      <Mes
        month={props.date.getMonth()}
        prev={prevCalendar}
        next={nextCalendar}
        max={cantidadMeses}
      />
      <ol className={classes.calendario}>
        <li className={classes.day}>Lun</li>
        <li className={classes.day}>Mar</li>
        <li className={classes.day}>Mié</li>
        <li className={classes.day}>Jue</li>
        <li className={classes.day}>Vie</li>
        <li className={classes.day}>Sáb</li>
        <li className={`${classes.day} ${classes.invalidDay}`}>Dom</li>
      </ol>
      <div
        className={classes.contenidoCalendario}
        style={{
          marginLeft:
            currentCalendar >= 0 ? `-${currentCalendar * move}em` : undefined,
        }} 
      >
        {content}
      </div>
    </div>
  );
};
export default React.memo(Calendario);

