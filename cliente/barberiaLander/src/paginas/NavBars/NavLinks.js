import classes from "./NavBar.module.css";
import classesCal from "./NavLinks.module.css";
import { NavLink } from "react-router-dom";
import { useContext, useReducer,useRef } from "react";
import AuthContext from "../../store/AuthContext";
import Menu from "./Menu/Menu";
import NavButton from "./NavButton/NavButton";
import LogoAzulH from "../../recursos/LogoChiquitoAzulHerramientas.png";
import Logo from './Logo/Logo';
import Marco from "../../components/UI/Marco/Marco";
import Note from "../../components/UI/Note/Note";
import { initialState,reducer } from "./reducer";
import inputs from "./inputs";
import useHttp from "../../hooks/useHttp";
import { comparaFechas } from "../../FuncionesAuxiliares/FuncionesAuxiliares";
import Modal from "../../components/UI/Modal/Modal";
import ComboBox from "../../components/ComboBox/ComboBox";
import SimpleButton from "../../components/UI/SimpleButton/SimpleButton";

const NavLinks = (props) => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const mobile = document.getElementById('root').clientWidth<900;
  const refM = useRef();
  const pedirCaja = useHttp()
  const comision = useHttp()
  const propinas = useHttp()
  const jornal = useHttp()
  const empleados = useHttp();


  const Admin = authCtx.user!==null &&authCtx.user.rol==='Administrador';

  const calcularComision = () =>{
    pedirCaja({url:'/cajaParaCalculos'},callComision);
  }
  const calcularPropina = () =>{
    pedirCaja({url:'/cajaParaCalculos'},callPropinas);
  }
  
  const respuestaComision = (res) =>{
    dispatch({type:'SHOW_MENSAJE',value:'El total acumulado en comisiones es de ' + res.mensaje.mensaje});
  }
  const respuestaPropina = (res) =>{
    console.log(res);
    dispatch({type:'SHOW_MENSAJE',value:'El total acumulado en propinas es de ' + res.mensaje.mensaje});
  }

  const callComision = (res) =>{
    const date = new Date();
    const caja = res.mensaje;
    if(caja.idCaja===-1) dispatch({type:'SHOW_MENSAJE',value:'La caja aun no está abierta'});
    else if(comparaFechas(date.getDate(),date.getMonth()+1,date.getFullYear(),caja.caja.fecha.substring(0,10))) dispatch({type:'SHOW_MENSAJE',value:'Hay una caja pendiente de una fecha pasada'});
    else{
      if(Admin){
        dispatch({type:'GUARDAR_CAJA',value:caja.caja.idCaja});
        empleados({url:'/listadoHabilitarEmpleados'},obtenerEmpleadosC);
      }else{
        comision(
          {
            url: "/comision",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: {ciEmpleado:authCtx.user.ciUsuario,idCaja:caja.caja.idCaja},
          },
          respuestaComision
        );
      }
    }
  }

  const callPropinas = (res) =>{
    const date = new Date();
    const caja = res.mensaje;
    if(caja.idCaja===-1) dispatch({type:'SHOW_MENSAJE',value:'La caja aun no está abierta'});
    else if(comparaFechas(date.getDate(),date.getMonth()+1,date.getFullYear(),caja.caja.fecha.substring(0,10))) dispatch({type:'SHOW_MENSAJE',value:'Hay una caja pendiente de una fecha pasada'});
    else{
      if(Admin){
        dispatch({type:'GUARDAR_CAJA',value:caja.caja.idCaja});
        empleados({url:'/listadoHabilitarEmpleados'},obtenerEmpleadosP);
      }else{
        comision(
          {
            url: "/propina",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: {ciEmpleado:authCtx.user.ciUsuario,idCaja:caja.caja.idCaja},
          },
          respuestaPropina
        );
      }
    }
  }

  const AdminCalC = () =>{
    comision(
      {
        url: "/comision",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {ciEmpleado:state.empleado,idCaja:state.caja},
      },
      respuestaComision
    );
  }

  const AdminCalP = () =>{
    comision(
      {
        url: "/propina",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {ciEmpleado:state.empleado,idCaja:state.caja},
      },
      respuestaPropina
    );
  }

  const obtenerEmpleadosC = (res) => {
    dispatch({type:'CARGAR',payload:res.mensaje.mensaje,destino:{function:AdminCalC,char:'C'}});
  }
  const obtenerEmpleadosP = (res) => {
    console.log(res);
    dispatch({type:'CARGAR',payload:res.mensaje.mensaje,destino:{function:AdminCalP,char:'P'}});
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const Menus = [
    {
      id: 1,
      text: "Administracion",
      opciones: [
        { id: 1, text: "Cuponera", to: "/cuponeras" },
        { id: 2, text: "Empleados", to: "/empleados" },
        { id: 3, text: "Reseteo contraseña", to: "/reseteo" },
        { id: 4, text: "Productos", to: "/productos" },
      ],
    },
  ];
  const INPUTS = inputs(state,dispatch);
  const NavOnClick = () => {
    if (props.onClick !== null) {
      props.onClick();
    }
    dispatch({ type: "RESET" });
  };
  return (
    <>
    <Marco>
      <Note show={state.Mensaje.show} onClose={()=>{dispatch({type:'HIDE_MENSAJE'})}}>{state.Mensaje.text}</Note>
      <Modal show={state.Modal} closed={()=>{dispatch({type:'HIDE_MODAL'})}} className={classesCal.modal}>
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
          <SimpleButton action={state.destino.function}>{`Calcular ${state.destino.char==='C'?'comisione':'propinas'}`}</SimpleButton>
        </div>
      </Modal>
    </Marco>
      <ul className={classes.navbarUl}>
        {!mobile&&<li className={classes.Logo}>
          <img className={classes.base} src={LogoAzulH} />
          <img className={classes.blur} src={LogoAzulH} />
          <img className={classes.brillo} src={LogoAzulH} />
        </li>}
        <li>
          <NavLink
            onClick={NavOnClick}
            exact
            activeClassName={classes.active}
            to="/inicio"
          >
            <span data="Inicio">Inicio</span>
          </NavLink>
        </li>
        {!mobile &&authCtx.user !== null &&
          (authCtx.user.rol === "Administrador" ||
            authCtx.user.rol === "Encargado") && (
            <li>
              <NavLink
                onClick={NavOnClick}
                exact
                activeClassName={classes.active}
                to="/caja/aperturacierre"
              >
                <span data="Abrir/Cerra Caja">Abrir/Cerra Caja</span>
              </NavLink>
            </li>
          )}
        {authCtx.user !== null && authCtx.user.rol !== "Empleado"  && (
            <li>
              <NavLink
                onClick={NavOnClick}
                exact
                activeClassName={classes.active}
                to="/agenda/preagendas"
              >
                <span data="Pre Agendas">{authCtx.user.rol === "Cliente"?'Agendas':'Pre Agendas'}</span>
              </NavLink>
            </li>
          )}
        <li>
          <NavLink
            onClick={NavOnClick}
            exact
            activeClassName={classes.active}
            to="/agenda/crearagenda"
          >
            <span data="Reserva">Reserva</span>
          </NavLink>
        </li>
        {(authCtx.user === null || authCtx.user.rol === "Cliente") && (
          <li>
            <NavLink
              onClick={NavOnClick}
              exact
              activeClassName={classes.active}
              to="/cuponeras"
            >
              <span data="Cuponera">Cuponera</span>
            </NavLink>
          </li>
        )}
        {!isLoggedIn && (
          <li>
            <NavLink
              onClick={NavOnClick}
              exact
              activeClassName={classes.active}
              to="/registro"
            >
              <span data="Registro">Registro</span>
            </NavLink>
          </li>
        )}
        {!isLoggedIn && (
          <li>
            <NavLink
              onClick={NavOnClick}
              exact
              activeClassName={classes.active}
              to="/login"
            >
              <span data="Login">Login</span>
            </NavLink>
          </li>
        )}
        {authCtx.user !== null &&
          (authCtx.user.rol === "Administrador" ||
            authCtx.user.rol === "Encargado") && (
            <li>
              <Menu
                current={state.place}
                active={state.active}
                onClick={(id) => {
                  dispatch({ type: "CHANGE_ACTIVE", value: id });
                }}
                change={(id) => {
                  if (props.onClick !== null) props.onClick();
                  dispatch({ type: "CHANGE_PLACE", value: id });
                }}
                miniMenu={Menus[0]}
              />
            </li>
          )}
        {authCtx.user !== null && authCtx.user.rol !== "Cliente" && (
          <li>
            <NavLink
              onClick={NavOnClick}
              exact
              activeClassName={classes.active}
              to="/agenda/visualagendas"
            >
              <span data="Visualizar Agendas">Visualizar Agendas</span>
            </NavLink>
          </li>
        )}
        <li>
          <NavButton onClick={calcularComision}>Comisiones</NavButton>
        </li>
        <li>
          <NavButton onClick={calcularPropina}>Propinas</NavButton>
        </li>
        {isLoggedIn && (
          <li>
            <NavButton onClick={authCtx.logout}>Log Out</NavButton>
          </li>
        )}
      </ul>
    </>
  );
};

export default NavLinks;
