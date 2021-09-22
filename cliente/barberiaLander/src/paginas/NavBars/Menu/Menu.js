import classes from "./Menu.module.css";
import { getElementById } from "../../../FuncionesAuxiliares/FuncionesAuxiliares";
import { NavLink } from "react-router-dom";
const Menu = (props) => {
  const miniMenu = props.miniMenu;
  const active = miniMenu.id === props.active;
  const inSide = getElementById(miniMenu.opciones,props.current)!==null;
  return (
    <div className={classes.miniMenu}>
      <div
        onClick={() => {
          props.onClick(miniMenu.id);
        }}
        className={active||inSide ? classes.active : ""}
      >
        <span data={miniMenu.text}>{miniMenu.text}</span>
      </div>
      {active && (
        <ul>
          {miniMenu.opciones.map((o) => {
            return (
              <li key={o.id}>
                <NavLink
                  to={o.to}
                  onClick={() => {
                    props.change(o.id);
                  }}
                  className={o.id === props.current ? classes.active : ""}
                >
                  <span data={o.text}>{o.text}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Menu;
