import Border from "../../components/UI/Border/Border";
import Marco from "../../components/UI/Marco/Marco";
import classes from "./ReseteoContra.module.css";
import inputs from "./inputs";
import { initialState, reducer } from "./reducer";
import { useReducer, useRef,useEffect,useContext } from "react";
import Input from "../../components/UI/Input/Input";
import SimpleButton from "../../components/UI/SimpleButton/SimpleButton";
import useHttp from "../../hooks/useHttp";
import AuthContext from "../../store/AuthContext";
import Note from "../../components/UI/Note/Note";
import { useHistory } from "react-router-dom";
/* Cliente 1/Empleado 2 */

const Reseteo = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const INPUTS = inputs(state, dispatch);
  const refCiE = useRef();
  const refCiC = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const reset = useHttp();
  useEffect(()=>{
    if (authCtx.user===null||(authCtx.user.rol!=='Administrador'&&authCtx.user.rol!=='Encargado')) history.replace('/');
  },[])
  const getRespuesta=(res) =>{
      if(res.mensaje.codigo!==200){
          dispatch({type:'SHOW_MENSAJE',value:res.mensaje.mensaje})
      }else{
          const number=res.mensaje.cliente.tel
          const text = '&text=Hola,%20su%20contraseña%20fue%20cambiada%20a%20inicio123.%20Por%20favor%20inicie%20sesión%20y%20cambie%20su%20contraseña.%20Si%20usted%20no%20solicitó%20este%20cambio%20comuníquese%20con%20nosotros.';
          window.location.href = "https://api.whatsapp.com/send?phone=+598"+number+''+text;
      }
      console.log(res.mensaje);
  }
  const submitRCE = (event) =>{
      event.preventDefault();
      if(!state.ciEmpleado.isValid) refCiE.current.focus();
      else{
          const data = {cedula:state.ciEmpleado.value,contra:'inicio123',identificador:1}
          reset(
              {
                url: "/reestablecerContra",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
              },
              getRespuesta
            );
      }
      
  }
  const submitRCC = (event) =>{
      event.preventDefault();
      if(!state.ciCliente.isValid) refCiC.current.focus();
      else{
          const data = {cedula:state.ciCliente.value,contra:'inicio123',identificador:2}
          reset(
              {
                url: "/reestablecerContra",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
              },
              getRespuesta
            );
      }
  }

  return (
    <Marco className={classes.container}>
        <Note show={state.Mensaje.show} onClose={()=>{dispatch({type:'HIDE_MENSAJE'})}}>{state.Mensaje.value}</Note>
      <Border>
        <h1>Cliente</h1>
        <form onSubmit={submitRCC}>
            <label className={classes.label}>Cédula Cliente</label>
            <Input className={classes.input}
                ref={refCiC}
                isValid={state.ciCliente.isValid}
                input={INPUTS[1]}
            />
            <SimpleButton type='submit' className={classes.button}> Resetear contraseña</SimpleButton>
        </form>
      </Border>
      <Border>
        <h1>Empleado</h1>
        <form onSubmit={submitRCE}>
            <label className={classes.label}>Cédula Empleado</label>
            <Input className={classes.input}
                ref={refCiE}
                isValid={state.ciEmpleado.isValid}
                input={INPUTS[0]}
            />
            <SimpleButton type='submit' className={classes.button}> Resetear contraseña</SimpleButton>
        </form>
      </Border>
    </Marco>
  );
};
export default Reseteo;
