import { useEffect, useContext, useReducer } from "react";
import { useHistory } from "react-router-dom";
import Modal from "../../components/UI/Modal/Modal";
import SimpleButton from "../../components/UI/SimpleButton/SimpleButton";
import ComboBox from "../../components/ComboBox/ComboBox";
import AuthContext from "../../store/AuthContext";
import useHttp from "../../hooks/useHttp";
import classes from "./Encargados.module.css";
import { getElementById } from "../../FuncionesAuxiliares/FuncionesAuxiliares";
const initialState = {
  empleado: { active: false, value: null },
  empleados: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CARGAR":
      return { ...state, empleados: [...action.payload],empleado: { value:state.empleado.value===null?action.payload[0].id:state.empleado.value,active: false } };
    case "CLICK":
      return {
        ...state,
        empleado: { ...state.empleado, active: !state.empleado.active },
      };
    case "SELECT":
      return { ...state, empleado: { active: false, value: action.value } };
  }
};

const Encargados = () => {
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
/*   const rol = getElementById(state.empleados, state.empleado.value);
  console.log(rol); */
  const habilitado = true;
  const clickHandler = () => {
    let nuevoEstado = habilitado ? 0 : 1;
    const data = {
      ciEmpleado: state.empleado.value,
      habilitado: nuevoEstado,
    };
    /* cambiarEstadoEmpleado(
      {
        url: "/modificarRolEmpleado",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      },
      getRespuesta
    ); */
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

export default Encargados;
