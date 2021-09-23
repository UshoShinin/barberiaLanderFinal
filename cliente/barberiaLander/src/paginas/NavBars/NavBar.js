import NavBarMobile from "./NavBarMobile";
import { useReducer,useRef,useContext, useEffect } from "react";
import NavBarPc from "./NavBarPc";
import classes from './NavBar.module.css';
import classesCal from "./NavLinks.module.css";
import Marco from "../../components/UI/Marco/Marco";
import Note from "../../components/UI/Note/Note";
import { initialState,reducer } from "./reducerBar";
import inputs from "./inputs";
import useHttp from "../../hooks/useHttp";
import Modal from "../../components/UI/Modal/Modal";
import ComboBox from "../../components/ComboBox/ComboBox";
import SimpleButton from "../../components/UI/SimpleButton/SimpleButton";
import Input from "../../components/UI/Input/Input";
import AuthContext from "../../store/AuthContext";

const Navbar = () => {
  const refM = useRef();
  const pedirCaja = useHttp()
  const comision = useHttp()
  const propina = useHttp()
  const jornal = useHttp()
  const empleados = useHttp();
  const authCtx = useContext(AuthContext);
  const Admin = authCtx.user!==null &&authCtx.user.rol==='Administrador';
  const calcularComision = () =>{
    if(Admin){
      dispatch({type:'SHOW_MODAL_C'});
    }else{
      callComision();
    }
  }

  const callComision = () =>{
    comision(
      {
        url: "/comision",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {ciEmpleado:!Admin?authCtx.user.ciUsuario:state.empleado.value},
      },
      respuestaComision
    );
  }
  const calcularPropina = () =>{
    if(Admin){
      dispatch({type:'SHOW_MODAL_P'});
    }else{
      callPropina();
    }
  }
  
  const callPropina = () =>{
    propina(
      {
        url: "/propina",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {ciEmpleado:!Admin?authCtx.user.ciUsuario:state.empleado.value},
      },
      respuestaPropina
    );
  }

  const calcularJornal = () =>{
    dispatch({type:'SHOW_MODAL_J'});
  }

  const callJoranal = () =>{
    const min = state.Minutos.value;
    if(min===''){
      jornal(
        {
          url: "/jornal",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: {ciEmpleado:!Admin?authCtx.user.ciUsuario:state.empleado.value,minExtra:0},
        },
        respuestaJornal
      );
    }else if(!state.Minutos.isValid)refM.current.focus();
    else{
      jornal(
        {
          url: "/jornal",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: {ciEmpleado:!Admin?authCtx.user.ciUsuario:state.empleado.value,minExtra:parseInt(min,10)},
        },
        respuestaJornal
      );
    }
  }

  const respuestaComision = (res) =>{
    dispatch({type:'SHOW_MENSAJE',value:`${res.mensaje.codigo===200?'El total acumulado en comisiones es de $':''} ${Math.round(res.mensaje.mensaje)}`});
  }
  const respuestaPropina = (res) =>{
    dispatch({type:'SHOW_MENSAJE',value:`${res.mensaje.codigo===200?'El total acumulado en propinas es de $':''} ${Math.round(res.mensaje.mensaje)}`});
  }
  const respuestaJornal = (res) =>{
    dispatch({type:'SHOW_MENSAJE',value:`${res.mensaje.codigo===200?'El jornal es $':''} ${Math.round(res.mensaje.mensaje)}`});
  }
  const obtenerEmpleados = (res) => {
    dispatch({type:'CARGAR',payload:res.mensaje.mensaje});
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const INPUTS = inputs(state,dispatch);

  useEffect(()=>{
    empleados({url:'/listadoHabilitarEmpleados'},obtenerEmpleados)
  },[])

  return <>
    <Marco>
      <Note show={state.Mensaje.show} onClose={()=>{dispatch({type:'HIDE_MENSAJE'})}}>{state.Mensaje.text}</Note>
      {/* Comision */}
      <Modal show={state.ModalC} closed={()=>{dispatch({type:'HIDE_MODAL_C'})}} className={classesCal.modal}>
        <div>
          <ComboBox 
          current={state.empleado.value} 
          active={state.empleado.active}
          height={8}
          onChange={(id) => {
            dispatch({ type: "SELECT", value: id });
          }}
          onClick={() => {
            dispatch({ type: "CLICK" });
          }}
          opciones={state.empleados}/>
          <SimpleButton action={callComision}>Calcular comisiones</SimpleButton>
        </div>
      </Modal>
      {/* Propina */}
      <Modal show={state.ModalP} closed={()=>{dispatch({type:'HIDE_MODAL_P'})}} className={classesCal.modal}>
        <div>
          <ComboBox 
          current={state.empleado.value} 
          active={state.empleado.active}
          height={8}
          onChange={(id) => {
            dispatch({ type: "SELECT", value: id });
          }}
          onClick={() => {
            dispatch({ type: "CLICK" });
          }}
          opciones={state.empleados}/>
          <SimpleButton action={callPropina}>Calcular propinas</SimpleButton>
        </div>
      </Modal>
      {/* Jornal */}
      <Modal show={state.ModalJ} closed={()=>{dispatch({type:'HIDE_MODAL_J'})}} className={classesCal.modal}>
        <div>
          {Admin&&<ComboBox 
          current={state.empleado.value} 
          active={state.empleado.active}
          height={8}
          onChange={(id) => {
            dispatch({ type: "SELECT", value: id });
          }}
          onClick={() => {
            dispatch({ type: "CLICK" });
          }}
          opciones={state.empleados}/>}
          <form className={classesCal.campos}>
            <label>Minutos extra</label>
            <Input
                ref={refM}
                isValid={state.Minutos.isValid}
                input={INPUTS[0]}
              />
          </form>
          <SimpleButton action={callJoranal}>Calcular jornal</SimpleButton>
        </div>
      </Modal>
    </Marco>
    <div className={classes.NavBar}>
      <NavBarMobile calcularComision = {calcularComision} calcularPropina={calcularPropina} calcularJornal={calcularJornal}/>
      <NavBarPc calcularComision = {calcularComision} calcularPropina={calcularPropina} calcularJornal={calcularJornal}/>
    </div>
  </>
};
export default Navbar;
