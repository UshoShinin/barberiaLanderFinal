import { useEffect, useContext, useReducer } from "react";
import { useHistory } from "react-router-dom";
import Modal from "../../components/UI/Modal/Modal";
import SimpleButton from "../../components/UI/SimpleButton/SimpleButton";
import ComboBox from "../../components/ComboBox/ComboBox";
import AuthContext from "../../store/AuthContext";
import useHttp from "../../hooks/useHttp";
import classes from "./Empleados.module.css";
import { getElementById } from "../../FuncionesAuxiliares/FuncionesAuxiliares";
const initialState = {
  empleado: { active: false, value: null },
  empleados: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CARGAR":
      return { ...state, empleados: [...action.payload],empleado: { ...state.empleado,active: false } };
    case "CLICK":
      return {
        ...state,
        empleado: { ...state.empleado, active: !state.empleado.active },
      };
    case "SELECT":
      return { ...state, empleado: { active: false, value: action.value } };
  }
};

const Empleados = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const getEmpleados = useHttp();
  const cambiarEstadoEmpleado = useHttp();
  const [state, dispatch] = useReducer(reducer, initialState);

  const obtenerEmpleados = (res) => {
    dispatch({ type: "CARGAR", payload: res.mensaje.mensaje });
  };

  const getRespuesta = (res) => {
    getEmpleados({ url: "/listadoHabilitarEmpleados" }, obtenerEmpleados);
  };
  const habilitado =
    state.empleado.value !== null
      ? getElementById(state.empleados, state.empleado.value).habilitado
      : false;
  const clickHandler = () => {
    let nuevoEstado = habilitado ? 0 : 1;
    const data = {
      ciEmpleado: state.empleado.value,
      habilitado: nuevoEstado,
    };
    cambiarEstadoEmpleado(
      {
        url: "/habilitarEmpleado",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      },
      getRespuesta
    );
  };

  useEffect(() => {
    if (
      user === null ||
      (user.rol !== "Administrador" && user.rol !== "Encargado")
    )
      history.replace("/");
    else {
      getEmpleados({ url: "/listadoHabilitarEmpleados" }, obtenerEmpleados);
    }
  }, [history, user]);
  return (
    <Modal className={classes.agrandar} closed ={()=>{history.replace("/");}} show={state.empleados !== null}>
      <form className={classes.form}>
        <ComboBox
          current={state.empleado.value}
          opciones={state.empleados}
          height={8}
          onChange={(id) => {
            dispatch({ type: "SELECT", value: id });
          }}
          onClick={() => {
            dispatch({ type: "CLICK" });
          }}
          active={state.empleado.active}
        />
        <SimpleButton
          action={clickHandler}
          color={`${habilitado ? "red" : ""}`}
          disabled={state.empleado.value === null}
        >{`${habilitado ? "Deshabilitar" : "Habilitar"}`}</SimpleButton>
      </form>
    </Modal>
  );
};

export default Empleados;
