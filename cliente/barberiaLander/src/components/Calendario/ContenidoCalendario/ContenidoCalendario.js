import Dias from "../Dias/Dias";
import {getYearChart} from "../../../hooks/useDayGenerator";
import classes from './ContenidoCalendario.module.css';
export const days = (date,diasAMostrar,actividad,obtenerHorarios,lostFocus) => {

const getHorarios = (horarios) => {
  /* console.log(horarios) */
 
  obtenerHorarios(horarios);
}
  let cantidadMeses;
  let diasMostrar;
    const Day = date;
    const month = Day.getMonth()+1;
    const year = Day.getFullYear();
    diasMostrar = diasAMostrar;
    cantidadMeses=diasMostrar.length;
    let keys = 1;
    let content = diasMostrar.map((meses) => {
      keys++;
      return (
        <ol key={keys} className={classes.diasCalendario}>
          <Dias
          diasMostrar={meses.dias}
          month={month+meses.id}
          year={year}
          actividad = {actividad}
          yearChart={getYearChart()}
          obtenerHorarios = {getHorarios}
          lostFocus={lostFocus}
        />
        </ol>
      );
      
    });
    return { cantidadMeses:cantidadMeses, content:content };
  };