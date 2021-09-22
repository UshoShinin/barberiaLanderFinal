import { useCallback } from "react";
import { getMonthValue,getDayIndex,getMonthChart  } from '../components/Calendario/Dias/FunctionsDias';
import { horariosDisponibilidad } from '../components/Calendario/FuncionesAuxiliares';
import { getElementById } from "../FuncionesAuxiliares/FuncionesAuxiliares";
export const getYearChart = () => {
  return 6;
}
const useDayGenerator = () => {
    const DaysGenerator = useCallback((diaActual , month, year,fechas,timeNeed,jornada) => {
        console.log('Running DaysGenerator');
        const misFechas = JSON.parse(fechas);
        const miJornada = JSON.parse(jornada);
        const dayIndex = getDayIndex(
          1,
          getMonthChart(month),
          getYearChart(),
          parseInt(year.toString().substr(-2), 10)
        );
        let diasTotales = 30;
        let diasMostrar = [];
        let diasAuxiliares = [];
        let diaAuxiliar;
        let diaSemana;
        let idMonth = 0;
        let myMonth = month;
        let myYear = year;
        let jornal;
        //Generar los días para el calendario
        //Carga los días desde el 1 hasta al actual de este mes, todos son invalidos
        for (let i = 1; i < diaActual; i++) {
          diasAuxiliares.push({
            num: i,
            mes:null,
            disponibilidad:{valido:false,horarios:[]},
            activo:null
          });
        }
      
        //Carga los días desde el actual 30 en adelante
        diaAuxiliar = diaActual;
        diaSemana = (dayIndex + diaActual - 1) % 7;
        diaSemana = (diaSemana === 0)?7:diaSemana;
        let maxDays = getMonthValue(myMonth,myYear);
        for (let i = diaActual; i <= maxDays; i++) {
          diaSemana = diaSemana > 7 ? 1 : diaSemana;
          jornal = getElementById(miJornada,diaSemana);
          diasAuxiliares.push({
            num: diaAuxiliar,
            mes:month,
            disponibilidad: horariosDisponibilidad(diasTotales,i, myMonth+idMonth,misFechas,timeNeed,jornal.entrada,jornal.salida),
            activo:diaSemana ===0 ? null:false,
          });
          diaAuxiliar++;
          diaSemana++;
          diasTotales--;
        }
        diasMostrar.push({id:idMonth,dias:[...diasAuxiliares]});
        while (diasTotales > 0) {
          idMonth++;
          myMonth++;
          diasAuxiliares = [];
          if((myMonth)>12){
              myMonth = 1;
              myYear++;
          }
          let maxDays = getMonthValue(myMonth,myYear);
          for (let i = 1; i <= maxDays; i++) {
            diaSemana = diaSemana > 7 ? 1 : diaSemana;
            diasAuxiliares.push({
              num: i,
              mes:myMonth,
              disponibilidad: horariosDisponibilidad(diasTotales,i, myMonth,misFechas,timeNeed,jornal.entrada,jornal.salida),
              activo:diaSemana ===0 ? null:false,
            });
            diaSemana++;
            diasTotales--;
          }
          diasMostrar.push({id:idMonth,dias:[...diasAuxiliares]});
        }
        return diasMostrar;
      },[]);
      return DaysGenerator;
};
export default useDayGenerator;