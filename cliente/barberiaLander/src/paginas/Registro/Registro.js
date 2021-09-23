import Input from "../../components/UI/Input/Input";
import { useRef, useReducer,useContext,useEffect } from "react";
import inputs from "./inputs";
import { initialState, reducer } from "./RegistroReducer";
import classes from "./Registro.module.css";
import Marco from "../../components/UI/Marco/Marco";
import Border from "../../components/UI/Border/Border";
import NormalCard from "../../components/UI/Card/NormalCard";
import Button from "../../components/UI/Button/Button";
import useHttp from "../../hooks/useHttp";
import AuthContext from "../../store/AuthContext";
import { useHistory } from "react-router-dom";  
import Note from "../../components/UI/Note/Note";
const Registro = (props) => {
  const refCi = useRef();
  const refNom = useRef();
  const refApe = useRef();
  const refTel = useRef();
  const refCon = useRef();
  const refConR = useRef();
  const authCtx = useContext(AuthContext);
  const [registroState, dispatchRegistro] = useReducer(reducer, initialState);
  const INPUTS = inputs(registroState, dispatchRegistro);
  const registrarse = useHttp();
  const history = useHistory();

  const getRespuesta = (res)=>{
    if(res.mensaje.codigo===200) history.replace('/login');
    dispatchRegistro({type:'SHOW_MENSAJE',value:res.mensaje.mensaje});
  }
  useEffect(()=>{
    if (authCtx.isLoggedIn) history.replace('/');
  },[])
  const submitHandler = (e) => {
    e.preventDefault();
    if (!registroState.ciUsuario.isValid) refCi.current.focus();
    else if (!registroState.nombre.isValid) refNom.current.focus();
    else if (!registroState.apellido.isValid) refApe.current.focus();
    else if (!registroState.telefono.isValid) refTel.current.focus();
    else if (!registroState.contra.isValid) refCon.current.focus();
    else if (!registroState.contraR.isValid) refConR.current.focus();
    else {
      const data = {
        ciUsuario: registroState.ciUsuario.value,
        nombre: registroState.nombre.value,
        apellido: registroState.apellido.value,
        telefono: registroState.telefono.value,
        contra: registroState.contra.value
      };
      registrarse(
        {
          url: "/registroCliente",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
        },
        getRespuesta
      );
    }
  };
  return (
    <Marco use={true} className={classes.alinear}>
      <Note show={registroState.Mensaje.show} onClose={()=>{dispatchRegistro({type:'HIDE_MENSAJE'})}}>{registroState.Mensaje.text}</Note>
      <form onSubmit={submitHandler}>
        <NormalCard className={classes.container}>
          <Border>
            <h1>Registro</h1>
            <div>
              <label>Cédula: </label>
              <Input
                ref={refCi}
                isValid={registroState.ciUsuario.isValid}
                input={INPUTS[0]}
              />
              <label>Nombre: </label>
              <Input
                ref={refNom}
                isValid={registroState.nombre.isValid}
                input={INPUTS[1]}
              />
              <label>Apellido: </label>
              <Input
                ref={refApe}
                isValid={registroState.apellido.isValid}
                input={INPUTS[2]}
              />
              <label>Teléfono: </label>
              <Input
                ref={refTel}
                isValid={registroState.telefono.isValid}
                input={INPUTS[3]}
              />
              <label>Contraseña: </label>
              <Input
                ref={refCon}
                isValid={registroState.contra.isValid}
                input={INPUTS[4]}
              />
              <label>Repetir contraseña: </label>
              <Input
                ref={refConR}
                isValid={registroState.contraR.isValid}
                input={INPUTS[5]}
              />
            </div>
            {registroState.problema !== -1 && (
              <p>{registroState.problemas[registroState.problema].pro}</p>
            )}
            <Button type="submit">Registrarse</Button>
          </Border>
        </NormalCard>
      </form>
    </Marco>
  );
};
export default Registro;
