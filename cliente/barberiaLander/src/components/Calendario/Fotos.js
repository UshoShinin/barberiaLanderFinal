import React from "react";
import classes from "./Fotos.module.css";
import ComboBox from "./../../components/ComboBox/ComboBox";
import { useReducer } from "react";
import { CSSTransition } from "react-transition-group";
import { getElementById } from "../../FuncionesAuxiliares/FuncionesAuxiliares";
const Fotos = (props) => {
  const Fotitos = JSON.parse(props.fotos);
  const imagenActual = getElementById(
    Fotitos,
    props.currentEmployee
  );
  const initialState = {
    Actual: { value: imagenActual.foto, mostrar: true,alt: Fotitos[0].title},
    Siguiente: { value: null, mostrar: false,alt:'' },
    canChange: true,
  };
  const heightCombo = document.getElementById("root").clientWidth >1400?8:4.8;
  const reducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_I":
        if (state.Actual.value === null) {
          return {
            canChange: false,
            Actual: { value: action.value, mostrar: false,alt:action.alt },
            Siguiente: { ...state.Siguiente, mostrar: false },
          };
        }
        return {
          Actual: { ...state.Actual, mostrar: false },
          Siguiente: { value: action.value, mostrar: false,alt:action.alt  },
        };

      case "MOSTRAR_ACTUAL":
        return {
          Actual: { ...state.Actual, mostrar: true },
          Siguiente: { value: null, mostrar: false,alt:'' },
        };
      case "MOSTRAR_SIGUIENTE":
        return {
          Actual: { value: null, mostrar: false,alt:'' },
          Siguiente: { ...state.Siguiente, mostrar: true },
        };
      case "PERMITIR": {
        return { ...state, canChange: true };
      }
      default:
        return {...state};
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const Actualizar = () => {
    const imagenActual = getElementById(
      Fotitos,
      props.currentEmployee
    );
    if (
      state.canChange &&
      ((state.Actual.mostrar && state.Actual.value !== imagenActual.foto) ||
        (state.Siguiente.mostrar && state.Siguiente.value !== imagenActual.foto))
    ) {
      dispatch({
        type: "CHANGE_I",
        value: imagenActual.foto,
        alt:imagenActual.title
      });
    }
  };
  Actualizar();

  const imagenes = (
    <>
      <CSSTransition
        key={1}
        in={state.Actual.mostrar}
        mountOnEnter
        unmountOnExit
        timeout={220}
        onExited={() => {
          dispatch({ type: "MOSTRAR_SIGUIENTE" });
          setTimeout(() => {
            dispatch({ type: "PERMITIR" });
            Actualizar();
          }, 220);
        }}
        classNames={{
          enter: "",
          enterActive: `${classes.Open}`,
          exit: "",
          exitActive: `${classes.Close}`,
        }}
      >
        <img className={`${classes.foto}`} src={state.Actual.value} alt={state.Actual.alt} />
      </CSSTransition>
      <CSSTransition
        key={2}
        in={state.Siguiente.mostrar}
        mountOnEnter
        unmountOnExit
        timeout={220}
        onExited={() => {
          dispatch({ type: "MOSTRAR_ACTUAL" });
          setTimeout(() => {
            dispatch({ type: "PERMITIR" });
            Actualizar();
          }, 220);
        }}
        classNames={{
          enter: "",
          enterActive: `${classes.Open}`,
          exit: "",
          exitActive: `${classes.Close}`,
        }}
      >
        <img className={`${classes.foto}`} src={state.Siguiente.value}  alt={state.Siguiente.alt} />
      </CSSTransition>
    </>
  );
  const comboChangeHandler = (id) => {
    if (state.canChange) {
      const empleado = getElementById(Fotitos, id)
      dispatch({
        type: "CHANGE_I",
        value: empleado.foto,
        alt:empleado.title
      });
      props.changeEmployee(id);
    }
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.marco}>
          <div className={classes.marcoIntermedio}>{imagenes}</div>
        </div>

        <div style={{ width: "60%", margin: "0 auto" }}>
          <ComboBox
            height={heightCombo}
            active={props.active}
            onClick={props.onClick}
            current={props.currentEmployee}
            onChange={comboChangeHandler}
            opciones={Fotitos}
          />
        </div>
      </div>
    </>
  );
};
export default React.memo(Fotos);
