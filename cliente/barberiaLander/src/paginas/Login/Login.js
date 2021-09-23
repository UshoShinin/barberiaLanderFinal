import { useRef, useReducer, useContext } from "react";
import classes from "./Login.module.css";
import Input from "../../components/UI/Input/Input";
import Marco from "../../components/UI/Marco/Marco";
import Button from "../../components/UI/Button/Button";
import Border from "../../components/UI/Border/Border";
import NormalCard from "../../components/UI/Card/NormalCard";
import { initialState, reducer } from "./LoginReducer";
import inputs from "./inputs";
import useHttp from "../../hooks/useHttp";
import AuthContext from "../../store/AuthContext";
import Modal from "../../components/UI/Modal/Modal";
import Note from "../../components/UI/Note/Note";
import { useHistory } from "react-router-dom";
import SimpleButton from "../../components/UI/SimpleButton/SimpleButton";
const Login = (props) => {
  const history = useHistory();

  const refCi = useRef();
  const refCon = useRef();
  const refCon1 = useRef();
  const refCon2 = useRef();
  const [loginState, dispatchLogin] = useReducer(reducer, initialState);
  const INPUTS = inputs(loginState, dispatchLogin);
  const authCtx = useContext(AuthContext);
  const login = useHttp();
  const reseteoContra = useHttp();
  const getRespuesta = (res) => {
    if (res.mensaje.codigo === 200) {
      authCtx.login(res.mensaje.usuario);
      history.replace('/');
    }else if(res.mensaje.codigo===400){
      dispatchLogin({type:'SHOW_MENSAJE',value:res.mensaje.error});
    }else{
      dispatchLogin({type:'MODAL',value:res.mensaje.usuario.rol});
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!loginState.ciUsuario.isValid) refCi.current.focus();
    else if (!loginState.contra.isValid) refCon.current.focus();
    else {
      const data = {
        ciUsuario: parseInt(loginState.ciUsuario.value, 10),
        contra: loginState.contra.value,
      };
      login(
        {
          url: "/login",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
        },
        getRespuesta
      );
    }
  };

  const reseteoRespuesta = (res) =>{
    console.log(res);
    if(res.mensaje.codigo===200){
      dispatchLogin({type:'CLOSE_MODAL'});
    }
  }
  const submitCambiar = (event) =>{
    event.preventDefault();
    if(!loginState.contra1.isValid) refCon1.current.focus();
    else if(!loginState.contra2.isValid) refCon2.current.focus();
    else{
      const data = {cedula:loginState.ciUsuario.value,contra:loginState.contra1.value,identificador:loginState.identificador};
      reseteoContra(
        {
          url: "/nuevaContra",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
        },
        reseteoRespuesta
      );
    }
  }

  return (<>
    <Modal className={classes.agrandar} show={loginState.modal} closed={()=>{}}>
      <h1>Reseteo de contraseña</h1>
      <form onSubmit={submitCambiar} className={classes.menuReset}>
        <div>
          <label>Contraseña: </label>
            <Input
              ref={refCon1}
              isValid={loginState.contra1.isValid}
              input={INPUTS[2]}
            />
          <label>Repeticion contraseña: </label>
            <Input
              ref={refCon2}
              isValid={loginState.contra2.isValid}
              input={INPUTS[3]}
            />
        </div>
        {loginState.problema !==-1 && (
          <p>{loginState.problemas[loginState.problema].pro}</p>
        )}
        <SimpleButton type='submit'>Cambiar contraseña</SimpleButton>
      </form>
    </Modal>
    <Note show={loginState.Mensaje.show} onClose={()=>{dispatchLogin({type:'HIDE_MENSAJE'})}}>{loginState.Mensaje.value}</Note>
    <Marco use={true} className={classes.alinear}>
      <form onSubmit={submitHandler}>
        <NormalCard className={classes.container}>
          <Border>
            <div>
              <label>Cédula: </label>
              <Input
                ref={refCi}
                isValid={loginState.ciUsuario.isValid}
                input={INPUTS[0]}
              />

              <label>Contraseña: </label>
              <Input
                ref={refCon}
                isValid={loginState.contra.isValid}
                input={INPUTS[1]}
              />
            </div>
            {loginState.problema === 0 || loginState.problema === 1 && (
              <p>{loginState.problemas[loginState.problema].pro}</p>
            )}
            {/* {errorLogin !== null && <p>{errorLogin}</p>} */}
            <Button type="submit">Iniciar Sesión</Button>
          </Border>
        </NormalCard>
      </form>
    </Marco>
  </>
    
  );
};
export default Login;
