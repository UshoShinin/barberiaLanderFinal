import { useEffect, useState } from "react";
import React from "react";
import classes from "./Visualizador.module.css";
import useHttp from "../../../../hooks/useHttp";
import SimpleButton from "../../../../components/UI/SimpleButton/SimpleButton";
import Border from "../../../../components/UI/Border/Border";
const Visualizador = React.memo((props) => {
  const getAgenda = useHttp();
  const obtenerAgenda = (respuesta) => {
    let servicios = {
      corte: false,
      barba: false,
      maquina: false,
      claritos: false,
      decoloracion: false,
      brushing: false,
    };
    respuesta.mensaje.mensaje.servicios.forEach((s) => {
      switch (s) {
        case 1:
          servicios.corte = true;
          break;
        case 4:
          servicios.barba = true;
          break;
        case 5:
          servicios.maquina = true;
          break;
        case 6:
          servicios.claritos = true;
          break;
        case 7:
          servicios.decoloracion = true;
          break;
        case 8:
          servicios.brushing = true;
          break;
        default:
          break;
      }
    });

    const agendaObtenida = {
      ...respuesta.mensaje.mensaje,
      fecha: respuesta.mensaje.mensaje.fecha.slice(0, 10),
      servicios: { ...servicios },
    };
    props.setAgenda(agendaObtenida);
  };
  const id = props.id;
  useEffect(() => {
    if (id !== null) {
      getAgenda({ url: "/agendaPorId?idAgenda=" + id }, obtenerAgenda);
    }
  }, [id, getAgenda]);
  const sendAgendas = () => {
    props.mostrarAgenda(props.agenda);
  };
  return (
    <>
      <Border className={classes.container}>
        <div className={classes.content}>
          <div>
            <h1
              className={`${classes.downData} ${
                props.agenda.IdAgenda !== -1 ? classes.activeData : ""
              }`}
            >
              Servicios
            </h1>
            <h2 className={`${props.agenda.servicios.corte ? classes.active : ""}`}>
              Corte
            </h2>
            <h2 className={`${props.agenda.servicios.barba ? classes.active : ""}`}>
              Barba
            </h2>
            <h2 className={`${props.agenda.servicios.maquina ? classes.active : ""}`}>
              Maquina
            </h2>
            <h2
              className={`${props.agenda.servicios.brushing ? classes.active : ""}`}
            >
              Brushing
            </h2>
            <h2
              className={`${
                props.agenda.servicios.decoloracion ? classes.active : ""
              }`}
            >
              Decoloración
            </h2>
            <h2
              className={`${props.agenda.servicios.claritos ? classes.active : ""}`}
            >
              Claritos
            </h2>
          </div>
          <div>
            <h1
              className={`${classes.downData} ${
                props.agenda.IdAgenda !== -1 ? classes.activeData : ""
              }`}
            >
              Datos Agenda
            </h1>
            <div className={classes.datos}>
              <label
                className={`${classes.downData} ${
                  props.agenda.IdAgenda !== -1 ? classes.activeData : ""
                }`}
              >
                Nombre Empleado
              </label>
              <label
                className={`${classes.hide} ${
                  props.agenda.IdAgenda !== -1 ? classes.show : ""
                }`}
              >
                {props.agenda.nombreEmpleado}
              </label>
              <label
                className={`${classes.downData} ${
                  props.agenda.IdAgenda !== -1 ? classes.activeData : ""
                }`}
              >
                Nombre Cliente
              </label>
              <label
                className={`${classes.hide} ${
                  props.agenda.IdAgenda !== -1 ? classes.show : ""
                }`}
              >
                {props.agenda.nombreCliente}
              </label>
              <label
                className={`${classes.downData} ${
                  props.agenda.IdAgenda !== -1 ? classes.activeData : ""
                }`}
              >
                Fecha
              </label>
              <label
                className={`${classes.hide} ${
                  props.agenda.IdAgenda !== -1 ? classes.show : ""
                }`}
              >
                {props.agenda.fecha}
              </label>
              <label
                className={`${classes.downData} ${
                  props.agenda.IdAgenda !== -1 ? classes.activeData : ""
                }`}
              >
                Hora Inicio
              </label>
              <label
                className={`${classes.hide} ${
                  props.agenda.IdAgenda !== -1 ? classes.show : ""
                }`}
              >{`${props.agenda.IdAgenda !== -1 ? props.agenda.horario.i : ""}`}</label>
              <label
                className={`${classes.downData} ${
                  props.agenda.IdAgenda !== -1 ? classes.activeData : ""
                }`}
              >
                Hora Fin
              </label>
              <label
                className={`${classes.hide} ${
                  props.agenda.IdAgenda !== -1 ? classes.show : ""
                }`}
              >{`${props.agenda.IdAgenda !== -1 ? props.agenda.horario.f : ""}`}</label>
              <label
                className={`${classes.downData} ${
                  props.agenda.IdAgenda !== -1 ? classes.activeData : ""
                }`}
              >
                Telefono
              </label>
              <label
                className={`${classes.hide} ${
                  props.agenda.IdAgenda !== -1 ? classes.show : ""
                }`}
              >
                {props.agenda.tel}
              </label>
            </div>
          </div>
        </div>
        <div className={classes.Descripcion}>
          <h2
            className={`${classes.downData} ${
              props.agenda.IdAgenda !== -1 ? classes.activeData : ""
            }`}
          >
            Descripcion
          </h2>

          <p
            className={`${classes.hide} ${
              props.agenda.IdAgenda !== -1 ? classes.show : ""
            }`}
          >
            {`${
              props.agenda.descripcion !== undefined
                ? props.agenda.descripcion
                : "No hay una descripción"
            }`}
          </p>
        </div>
        {!props.cliente && (
          <SimpleButton
            disabled={props.agenda.IdAgenda === -1}
            active={false}
            action={sendAgendas}
          >
            Comenzar a modificar
          </SimpleButton>
        )}
      </Border>
    </>
  );
});
export default Visualizador;
