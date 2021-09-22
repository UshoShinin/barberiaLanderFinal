import { getElementById } from "../../FuncionesAuxiliares/FuncionesAuxiliares";
import { getDayIndex2 } from "../Calendario/Dias/FunctionsDias";
/* Extrae todas las fotos id y nombres de una lista de empleados */
export const extraerFotos = (empleados) => {
  let resultado = [];
  empleados.forEach((empleado) => {
    resultado.push({
      id: empleado.id,
      title: empleado.title,
      foto: empleado.foto,
    });
  });
  return resultado;
};
/* Espera un día, un mes y una lista de fechas, en caso que no le llegen fechas no hace nada */
export const obtenerHorariosDeDia = (dia, myMonth, fechas) => {
  /* console.log(dia, myMonth, fechas); */
  if (fechas) {
    /* Recorre las fechas y cuando encuentra la que tiene el día y mes mandados devuelve los horarios */
    for (let i = 0; i < fechas.length; i++) {
      if (fechas[i].dia === dia && fechas[i].mes === myMonth) {
        return fechas[i].horarios;
      }
    }
  }
  return null;
};

export const getIdByTitle = (list, title) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].title === title) return list[i].id;
  }
  return null;
};

/* Esta funciona genera los días del calendario, si ese día no tiene horarios y no es domingo automaticamente está disponible
en caso de que tenga horarios se evalúan si hay horarios disponibles y se devuelven */
export const horariosDisponibilidad = (
  diasTotales,
  dia,
  mes,
  fechas,
  servicios,
  entrada,
  salida
) => {
  const horarios = obtenerHorariosDeDia(dia, mes, fechas);
  if (diasTotales < 1 || entrada === null)
    return { valido: false, horariosDisponibles: [] };
  if (horarios === null) return { valido: true, horariosDisponibles: [] };
  else {
    const resultado = horariosAgendarDisponibles(
      horarios,
      servicios,
      entrada,
      salida
    );
    if (resultado.length > 0) {
      return {
        valido: true,
        horariosDisponibles: resultado,
      };
    }
  }
  return {
    valido: false,
    horariosDisponibles: [],
  };
};

export const transformStringNumber = (horario) => {
  const hor = parseInt(horario.slice(0, 2), 10);
  const min = parseInt(horario.slice(3, 5), 10);
  return { h: hor, m: min };
};

export const transformNumberString = (hor) => {
  return `${hor.h > 9 ? hor.h : "0" + hor.h}:${
    hor.m > 9 ? hor.m : "0" + hor.m
  }`;
};

export const horarioEnMinutos = (hora) => {
  return hora.h * 60 + hora.m;
};

export const minutosAHorarios = (minutos) => {
  return { h: (minutos - (minutos % 60)) / 60, m: minutos % 60 };
};
/* Carga todos los horarios disponibles dentro de una lista de ghrarios y una cantidad de tiempo que es necesario ocupar */
export const horariosAgendarDisponibles = (
  horarios,
  timeNeed,
  entrada,
  salida
) => {
  let hora = entrada;
  const horaCierre = salida;
  let horariosDisponibles = [];
  let inicio = 0;
  let tengoTiempo;
  let horarioBase;
  if (horarios[0].i === hora) {
    hora = horarios[0].f;
    inicio = 1;
  }
  //poner que si las horas coinciden no haga calculos
  if (horarios.length > 0) {
    horarioBase = hora;
    for (let i = inicio; i < horarios.length; i++) {
      tengoTiempo = diferenciaDeTiempo(horarioBase, horarios[i].i);
      if (tengoTiempo >= timeNeed) {
        horariosDisponibles = [
          ...horariosDisponibles,
          ...cargarHorarios(
            horarioEnMinutos(transformStringNumber(horarioBase)),
            horarioEnMinutos(transformStringNumber(horarios[i].i)) - timeNeed
          ),
        ];
      }

      horarioBase = horarios[i].f;
    }
  }
  //poner que si las horas coinciden no haga calculos
  tengoTiempo = diferenciaDeTiempo(horarioBase, horaCierre);
  if (tengoTiempo >= timeNeed) {
    horariosDisponibles = [
      ...horariosDisponibles,
      ...cargarHorarios(
        horarioEnMinutos(transformStringNumber(horarioBase)),
        horarioEnMinutos(transformStringNumber(horaCierre)) - timeNeed
      ),
    ];
  }
  return horariosDisponibles;
};

const diferenciaDeTiempo = (tiempoBase, siguienteHorario) => {
  const BH = transformStringNumber(tiempoBase);
  const SH = transformStringNumber(siguienteHorario);
  return horarioEnMinutos(SH) - horarioEnMinutos(BH);
};
/* Carga todas las horas entre un horario de inicio de fin */
export const cargarHorarios = (inicio, fin) => {
  let lista = [];
  while (inicio <= fin) {
    lista.push(minutosAHorarios(inicio));
    inicio += 15;
  }
  return lista;
};
export const cargarHorariosEnMinutos = (dia, Employee,tiempo) => {
  let misHorarios = [];
  const d = dia.d;
  const m = dia.m;
  const date = new Date();
  const realMonth = date.getMonth() + 1;
  const realYear = date.getFullYear();
  const y = m < realMonth ? realYear + 1 : realYear;
  const diaSemana = getDayIndex2(d, m, y);
  const jornada = getElementById(Employee.jornada, diaSemana);
  const entrada = transformStringNumber(jornada.entrada);
  const salida = transformStringNumber(jornada.salida);
  let H = entrada.h;
  let M = entrada.m;
  let nuevaSalida = minutosAHorarios(horarioEnMinutos(salida)-tiempo);
  let i = 1;
  while (H !== nuevaSalida.h || M !== nuevaSalida.m) {
    misHorarios.push({
      id: i,
      title: `${H}:${M < 10 ? "0" + M : M}`,
    });
    M += 15;
    if (M === 60) {
      M = 0;
      H++;
    }
    i++;
  }
  misHorarios.push({
    id: i,
    title: `${H}:${M < 10 ? "0" + M : M}`,
  });

  return misHorarios;
};

/* Te da el día con su propiedad mostrar del array que gestiona la iluminación de los días */
export const getDayOfDate = (dia, mes, dates) => {
  for (let i = 0; i < dates.length; i++) {
    if (dates[i].dia === dia && dates[i].mes === mes) return dates[i];
  }
};

export const calcularTiempo = (empleado, servicios) => {
  const duracionEmpleado = empleado.duracion.map((dura) => {
    return { id: dura.idServicio, duracion: dura.duracion };
  });
  const servicesList = Object.values(servicios);
  let total = 0;
  let ignorar;
  servicesList.forEach((ser) => {
    if (ser.active && ser.id !== ignorar) {
      if (ser.id === 1 && servicesList[1].active) {
        ignorar = servicesList[1].id;
        total += getElementById(duracionEmpleado, 2).duracion;
      } else if (ser.id === 4 && servicesList[2].active) {
        ignorar = servicesList[2].id;
        total += getElementById(duracionEmpleado, 3).duracion;
      } else {
        total += getElementById(duracionEmpleado, ser.id).duracion;
      }
    }
  });
  return total * 15;
};
