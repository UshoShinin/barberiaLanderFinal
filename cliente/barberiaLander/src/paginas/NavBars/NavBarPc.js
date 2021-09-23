import NavLinks from "./NavLinks";
import classes from './NavBar.module.css';
const NavBarPc = (props) => {
  return (
    <nav className={classes.navPc}>
      <NavLinks calcularComision = {props.calcularComision} calcularPropina={props.calcularPropina} calcularJornal={props.calcularJornal} onClick={null}/>
    </nav>
  );
};

export default NavBarPc;
