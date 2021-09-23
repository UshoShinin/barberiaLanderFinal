import classes from "./VisualAgendas.module.css";
import {
  generarHoras,
  generarCupos,
  generarNavegacion,
} from "./GenerarContenidoVisualAgenda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { animateScroll as scroll } from "react-scroll";
import { useEffect, useContext, useReducer } from "react";
import LoaddingSpinner from "../../../components/LoaddingSpinner/LoaddingSpinner";
import useHttp from "../../../hooks/useHttp";
import CrearAgenda from "../CrearAgenda";
import AuthContext from "../../../store/AuthContext";
import { useHistory } from "react-router-dom";
import { initialState, reducer } from "./reducer";
import Note from "../../../components/UI/Note/Note";
import Marco from "../../../components/UI/Marco/Marco";

const VisualAgendas = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const fetchAgendas = useHttp();
  const getAgenda = useHttp();

  const obtenerAgenda = (res) => {
    if (res.mensaje.codigo === 200) {
      dispatch({ type: "SET_AGENDA", payload: res.mensaje.mensaje });
    } else {
      fetchAgendas({ url: "/listadoAgendas" }, obtenerAgendas);
    }
  };

  const obtenerAgendas = (res) => {
    dispatch({ type: "CARGAR", payload: res.mensaje.agendas });
  };

  const obtenerAgendasModificadas = (res) => {
    dispatch({
      type: "RESET",
      payload: res.mensaje.agendas,
      value: "Agenda modificada correctamente",
    });
  };

  const user = authCtx.user;
  useEffect(() => {
    if (user === null || user.rol === "Cliente") history.replace("/");
    else fetchAgendas({ url: "/listadoAgendas" }, obtenerAgendas);
  }, [user, history, fetchAgendas]);

  let Mostrar = [];
  let tope = null;
  let empleados;
  let colorFilaI = 1;
  let i = 0;
  let ocupar;
  let cantidadMostrar;
  const tamaño = document.getElementById("root").clientWidth;
  if (tamaño < 581) {
    cantidadMostrar = 1;
  } else if (tamaño < 980) {
    cantidadMostrar = 2;
  } else {
    cantidadMostrar = 4;
  }
  if (state.agendas !== null) {
    const final =
      state.agendas.length > (state.inicio + 1) * cantidadMostrar
        ? (state.inicio + 1) * cantidadMostrar
        : state.agendas.length;
    for (let i = state.inicio * cantidadMostrar; i < final; i++) {
      Mostrar.push(state.agendas[i]);
    }
    ocupar = 100 / Mostrar.length;
    empleados = generarCupos(Mostrar, colorFilaI, (id) => {
      getAgenda({ url: "/agendaPorId?idAgenda=" + id }, obtenerAgenda);
    },user).map((divA) => {
      i++;
      return (
        <div
          key={i}
          className={classes.bordeIntento}
          style={{ width: `${ocupar}%` }}
        >
          {divA}
        </div>
      );
    });
    const mod = state.agendas.length % cantidadMostrar;
    tope =
      (state.agendas.length - mod + (mod > 0 ? cantidadMostrar : 0)) /
      cantidadMostrar;
  }

  return (
    <>{state.agendas === null &&<Marco use={true} logo={true}><LoaddingSpinner /></Marco>}
      <Note
        show={state.Mensaje.show}
        onClose={() => {
          dispatch({ type: "HIDE_MENSAJE" });
        }}
      >
        {state.Mensaje.value}
      </Note>
      {state.agenda !== null && (
        <CrearAgenda
          exitModificar={() => {
            fetchAgendas({ url: "/listadoAgendas" }, obtenerAgendasModificadas);
          }}
          agenda={state.agenda}
        />
      )}
      {state.agenda === null && (
        <>
          
          {state.agendas !== null && (
            <div className={classes.myContainer}>
              <div className={classes.navigation}>
                <div>
                  <div className={classes.arrow}>
                    {state.inicio > 0 && (
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        onClick={() => {
                          dispatch({ type: "RETROCEDER" });
                        }}
                      />
                    )}
                  </div>
                  <p>
                    {state.inicio + 1} de {tope}
                  </p>
                  <div className={classes.arrow}>
                    {state.inicio < tope - 1 && (
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        onClick={() => {
                          dispatch({ type: "AVANZAR" });
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              {generarNavegacion(10, 20)}
              <div className={classes.container}>
                <div className={classes.marcas}>{generarHoras(10, 20)}</div>
                <div className={classes.empleados}>{empleados}</div>
              </div>
              <button
                className={classes.toTheTop}
                onClick={() => {
                  scroll.scrollToTop();
                }}
              >
                <FontAwesomeIcon icon={faChevronUp} />
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default VisualAgendas;
