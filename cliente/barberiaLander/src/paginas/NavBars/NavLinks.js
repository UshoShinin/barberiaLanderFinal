import classes from "./NavBar.module.css";
import { NavLink } from "react-router-dom";
import { useContext, useReducer } from "react";
import AuthContext from "../../store/AuthContext";
import Menu from "./Menu/Menu";
import NavButton from "./NavButton/NavButton";
import LogoAzulH from "../../recursos/LogoChiquitoAzulHerramientas.png";
import Logo from './Logo/Logo';
import { initialState,reducer } from "./reducerLinks";
const NavLinks = (props) => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const mobile = document.getElementById('root').clientWidth<990;
  const Admin = authCtx.user!==null &&authCtx.user.rol==='Administrador';
  const [state, dispatch] = useReducer(reducer, initialState);
  const Menus = [
    {
      id: 1,
      text: "Administracion",
      opciones: [
        { id: 1, text: "Cuponera", to: "/cuponeras" },
        { id: 2, text: "Empleados", to: "/empleados" },
        { id: 3, text: "Encargados", to: "/encargados" },
        { id: 4, text: "Reseteo contraseña", to: "/reseteo" },
        { id: 5, text: "Productos", to: "/productos" },
      ],
    },
  ];
  const NavOnClick = () => {
    if (props.onClick !== null) {
      props.onClick();
    }
    dispatch({ type: "RESET" });
  };
  return (
    <>
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
                <span data={authCtx.user.rol === "Cliente"?'Agendas':'Pre Agendas'}>{authCtx.user.rol === "Cliente"?'Agendas':'Pre Agendas'}</span>
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
        {authCtx.user !== null && authCtx.user.rol !== "Cliente"&&
        <>
          <li>
            <NavButton onClick={props.calcularComision}>Comisiones</NavButton>
          </li>
          <li>
            <NavButton onClick={props.calcularPropina}>Propinas</NavButton>
          </li>
          <li>
            <NavButton onClick={props.calcularJornal}>Jornal</NavButton>
          </li>
        </>
        }
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
