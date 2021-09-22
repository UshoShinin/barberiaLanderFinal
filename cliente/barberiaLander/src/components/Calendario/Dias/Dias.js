import classes from "./Dias.module.css";
import { getMonthChart, getDayIndex } from "./FunctionsDias";

const Dias = (props) => {
  let classFirstDay;
  let primerDia;
  let diasAuxiliares = [];
  let mes = props.month;
  let year = props.year
  if(props.month>12){
    mes = mes - 12;
    year = year+1;
  }
  const dayIndex = getDayIndex(
    1,
    getMonthChart(mes),
    props.yearChart,
    parseInt(year.toString().substr(-2), 10)
  );
  let contenido;
  //Asigna una clase para marcar que el día de inicio empieze en su lugar correspondiente del calendario
  switch (dayIndex) {
    case 1:
      classFirstDay = classes.Lun;
      break;
    case 2:
      classFirstDay = classes.Mar;
      break;
    case 3:
      classFirstDay = classes.Mie;
      break;
    case 4:
      classFirstDay = classes.Jue;
      break;
    case 5:
      classFirstDay = classes.Vie;
      break;
    case 6:
      classFirstDay = classes.Sab;
      break;
    case 7:
      classFirstDay = classes.Dom;
      break;
      default:
        break;
  }
  primerDia = props.diasMostrar[0];
  diasAuxiliares = props.diasMostrar.filter((dia)=>(dia.num!==1));
  contenido = diasAuxiliares.map((dia) => {
    let par;
    if(dia.disponibilidad.valido){
      par= <p onClick={()=>{
        props.obtenerHorarios({value:dia.disponibilidad.horariosDisponibles,dia:{d:dia.num,m:dia.mes}});
      }} className={`${classes.dia} ${dia.activo?classes.activo:''}`}>{dia.num}</p>;
    }else{
      par= <p className={classes.invalid}>{dia.num}</p>;
    }
    return (
      <li className={classes.lis} key={dia.num} onClick={props.lostFocus}>
        {par}
      </li>
    );
  });
  return (
    <>
      <li className={`${classFirstDay} ${classes.lis}`}><p className={`${primerDia.disponibilidad.valido?classes.dia:classes.invalid} ${primerDia.activo?classes.activo:''}`}>{primerDia.num}</p></li>
      {contenido}
    </>
  );
};
export default Dias;