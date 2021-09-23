import NormalCard from "../../../components/UI/Card/NormalCard";
import classes from "./PreAgendas.module.css";
import Lista from "./Lista/Lista";
import useHttp from "../../../hooks/useHttp";
import { useEffect, useReducer, useContext } from "react";
import LoaddingSpinner from "../../../components/LoaddingSpinner/LoaddingSpinner";
import Switch from "../../../components/UI/Switch/Switch";
import Visualizador from "./Visualizador/Visualizador";
import CrearAgenda from "../CrearAgenda";
import AuthContext from "../../../store/AuthContext";
import { useHistory } from "react-router-dom";
import SimpleNote from "../../../components/UI/Note/SimpleNote";
import Note from "../../../components/UI/Note/Note";
import { initialState, reducer } from "./FAReducer";
import Modal from "../../../components/UI/Modal/Modal";
import Marco from "../../../components/UI/Marco/Marco";

const PreAgendas = () => {
  const history = useHistory();
  const [agendasState, dispatch] = useReducer(reducer, initialState);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const esCliente = user !== null && user.rol === "Cliente";
  const obtenerAgendas = (agendas) => {
    console.log(agendas.mensaje);
    if(agendas.mensaje.codigo===400){
      dispatch({type: "SHOW_MODAL",value: agendas.mensaje.mensaje});
    }else{
      if (esCliente) {
        dispatch({
          type: "CARGA",
          payload: agendas.mensaje,
        });
      } else {
        dispatch({
          type: "CARGA",
          payload: agendas.mensaje.preAgendas,
          manejo: agendas.mensaje.manejoAgenda.AceptarRechazar,
        });
      }
    }
  };

  const getRespuesta = (res) => {
    console.log(res);
    dispatch({type:'SHOW_MENSAJE',value:res.mensaje.mensaje});
    fetchAgendas({ url: "/listadoPreAgendas" }, obtenerAgendas)
  };
  const getRespuestaEliminar = (res) => {
    dispatch({type:'SHOW_MENSAJE',value:res.mensaje.mensaje});
    dispatch({type:'SOLTAR_AGENDA',value:res.mensaje.mensaje});
    fetchAgendas({ url: "/listadoPreAgendas" }, obtenerAgendas)
  };

  const respuestaModAR = (res) => {
    dispatch({
      type: "RESPUESTA",
      value: res.mensaje.valor,
      mensaje: res.mensaje.mensaje,
    });
  };

  const fetchAgendas = useHttp();

  const aceptar = useHttp();
  const rechazar = useHttp();
  const manejoAgenda = useHttp();

  useEffect(() => {
    if (user === null || user.rol === "Empleado") history.replace("/");
    else if (esCliente)
      fetchAgendas(
        { url: "/getAgendasCliente?cedula=" + user.ciUsuario },
        obtenerAgendas
      );
    else fetchAgendas({ url: "/listadoPreAgendas" }, obtenerAgendas);
  }, [user, history, fetchAgendas]);
  const showAgenda = (agendita) => {
    dispatch({ type: "GET_AGENDA", agenda: agendita });
  };
  const aceptarAgenda = (agenda) => {
    aceptar(
      {
        url: "/aceptarAgenda",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: agenda,
      },
      getRespuesta
    );
  };

  const rechazarAgenda = (agenda) => {
    rechazar(
      {
        url: "/eliminarAgenda",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: agenda,
      },
      getRespuestaEliminar
    );
  };
  const aceptarT = agendasState.aceptar;
  const rechazarT = agendasState.rechazar;
  return (
    <>
    {agendasState.agendas === null &&<Marco use={true} logo={true}><LoaddingSpinner /></Marco>}
    <Modal show={agendasState.Modal.show} closed={()=>{history.replace("/")}}><h1>{agendasState.Modal.value}</h1></Modal>
      {agendasState.agendaAModificar !== null && (
        <CrearAgenda
          exitModificar={() => {
            dispatch({ type: "GET_AGENDA", agenda: null });
            fetchAgendas({ url: "/listadoPreAgendas" }, obtenerAgendas);
          }}
          agenda={agendasState.agendaAModificar}
        />
      )}
      {agendasState.agendaAModificar === null && (
        <NormalCard className={classes.ajuste}>
          <Note show={agendasState.Mensaje.show} onClose={()=>{dispatch({type:'HIDE_MENSAJE'})}}>{agendasState.Mensaje.value}</Note>
          <SimpleNote
            show={agendasState.preguntaAceptar}
            aceptar={() => {
              manejoAgenda(
                {
                  url:
                    "/manejoDeAgendas?aceptarRechazar=" + `${aceptarT ? 0 : 1}`,
                },
                respuestaModAR
              );
            }}
            rechazar={() => {
              dispatch({ type: "PREGUNTA_ACEPTAR" });
            }}
          >
            {`¿Está seguro que desea ${
              aceptarT ? "des" : ""
            }activar el aceptar todo?`}
          </SimpleNote>
          <SimpleNote
            show={agendasState.preguntaRechazar}
            aceptar={() => {
              manejoAgenda(
                {
                  url:
                    "/manejoDeAgendas?aceptarRechazar=" +
                    `${rechazarT ? 0 : -1}`,
                },
                respuestaModAR
              );
            }}
            rechazar={() => {
              dispatch({ type: "PREGUNTA_RECHAZAR" });
            }}
          >
            {`¿Está seguro que desea ${
              rechazarT ? "des" : ""
            }activar el rechazar todo?`}
          </SimpleNote>
          {agendasState.agendas !== null && (
            <div className={classes.container}>
              <div
                className={`${
                  esCliente ? classes.listadoCliente : classes.listado
                }`}
              >
                {agendasState.agendas !== null && (
                  <Lista
                    cliente={esCliente}
                    items={agendasState.agendas}
                    select={(id) => {
                      dispatch({ type: "SELECT_AGENDA", value: id });
                    }}
                    aceptar={aceptarAgenda}
                    rechazar={rechazarAgenda}
                  />
                )}
                {!esCliente && (
                  <div className={classes.opciones}>
                    <div className={classes.label}>
                      <h2>Aceptar todo</h2>
                    </div>
                    <div className={classes.actions}>
                      <Switch
                        onCheck={() => {
                          dispatch({ type: "PREGUNTA_ACEPTAR" });
                        }}
                        active={agendasState.aceptar}
                      />
                    </div>
                    <div className={classes.label}>
                      <h2>Rechazar todo</h2>
                    </div>
                    <div className={classes.actions}>
                      <Switch
                        onCheck={() => {
                          dispatch({ type: "PREGUNTA_RECHAZAR" });
                        }}
                        active={agendasState.rechazar}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className={classes.editor}>
                <Visualizador
                  cliente={esCliente}
                  agenda = {agendasState.agendaSeleccionada}
                  setAgenda = {(ag)=>{dispatch({type:'TOMAR_AGENDA',value:ag})}}
                  id={agendasState.agendaId}
                  mostrarAgenda={showAgenda}
                />
              </div>
            </div>
          )}
        </NormalCard>
      )}
    </>
  );
};

export default PreAgendas;
