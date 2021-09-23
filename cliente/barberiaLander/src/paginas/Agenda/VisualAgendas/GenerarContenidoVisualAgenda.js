import {
  transformStringNumber,
  horarioEnMinutos,
  cargarHorarios,
} from "../../../components/Calendario/FuncionesAuxiliares";
import classes from "./GenerarContenidoVisualAgenda.module.css";
import { Link } from "react-scroll";
export const generarHoras = (i, f) => {
  return cargarHorarios(i * 60, f * 60).map((h) => {
    let hora = `${h.h}:${h.m < 10 ? "0" + h.m : h.m}`;
    return (
      <p id={h.m === 0 ? h.h : ""} key={hora}>
        {hora}
      </p>
    );
  });
};

const diferencia = (i, f) => {
  const ini = horarioEnMinutos(transformStringNumber(i));
  const fin = horarioEnMinutos(transformStringNumber(f));
  const dif = (fin - ini) / 15;
  return dif;
};

export const generarCupos = (empleados, colorFilaI, click, user) => {
  let horariosHTML;
  let auxiliarDiv = [];
  for (let i = 0; i < empleados.length; i++) {
    horariosHTML = null;
    let horarios = [];
    let cuantos = [];
    let hora;
    let calDiff = 0;
    if (empleados[i].agendas.length > 0) {
      hora = empleados[i].agendas[0];
      let initialMargin = 0;
      let cantidad = 20;
      let separacion = 8;
      let colorI = colorFilaI === 2 ? 1 : 2;
      calDiff = hora !== undefined ? diferencia(hora.i, hora.f) : null;
      if (hora.i !== "10:00") {
        initialMargin = diferencia("10:00", hora.i);
      }
      for (let k = 0; k < calDiff; k++) {
        cuantos.push(
          <div
            className={`${classes.cuanto} ${
              colorFilaI === 1 ? classes.color1 : classes.color2
            }`}
          ></div>
        );
      }
      let cuantosHTML = cuantos.map((c) => {
        return c;
      });
      horarios.push(
        <div
          className={classes.horario}
          style={{
            marginTop: `${
              (cantidad + separacion) * initialMargin + separacion
            }px`,
          }}
          onClick={() => {
            if(user.rol === "Administrador"){
              click(empleados[i].agendas[0].idAgenda);
            }else if (user.rol === "Empleado" && user.ciUsuario === empleados[i].ci) {
              click(empleados[i].agendas[0].idAgenda);
            }
          }}
        >
          {cuantosHTML}
        </div>
      );

      for (let j = 1; j < empleados[i].agendas.length; j++) {
        cuantos = [];
        const ini = empleados[i].agendas[j].i;
        const fin = empleados[i].agendas[j].f;
        calDiff = diferencia(ini, fin);
        for (let k = 0; k < calDiff; k++) {
          cuantos.push(
            <div
              className={`${classes.cuanto} ${
                colorI === 1 ? classes.color1 : classes.color2
              }`}
            ></div>
          );
        }
        let cuantosHTML = cuantos.map((c) => {
          return c;
        });
        horarios.push(
          <div
            className={classes.horario}
            style={{
              marginTop: `${
                diferencia(empleados[i].agendas[j - 1].f, ini) *
                  (cantidad + separacion) +
                separacion
              }px`,
            }}
            onClick={() => {
              if(user.rol === "Administrador"){
                click(empleados[i].agendas[j].idAgenda);
              }else if (user.rol === "Empleado" && user.ciUsuario === empleados[i].ci) {
                click(empleados[i].agendas[j].idAgenda);
              }
            }}
          >
            {cuantosHTML}
          </div>
        );
        if (colorI === 1) {
          colorI = 2;
        } else {
          colorI = 1;
        }
      }
      horariosHTML = horarios.map((h) => {
        return h;
      });
    }
    auxiliarDiv.push(
      <>
        <h1 className={classes.title}>{empleados[i].nombreEmpleado}</h1>
        {horariosHTML}
      </>
    );
    if (colorFilaI === 1) {
      colorFilaI = 2;
    } else {
      colorFilaI = 1;
    }
  }
  return auxiliarDiv;
};

export const generarNavegacion = (ini, fin) => {
  let list = [];
  for (let i = ini; i <= fin; i++) {
    list.push(i);
  }
  return (
    <ul className={classes.Nav}>
      {list.map((h) => (
        <Link
          key={h}
          className={classes.Link}
          activeClass="active"
          to={String(h)}
          spy={true}
          smooth={true}
          offset={-10}
          duration={500}
        >
          {h}
        </Link>
      ))}
    </ul>
  );
};
