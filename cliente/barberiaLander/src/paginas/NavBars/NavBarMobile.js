import NavLinks from "./NavLinks";
import classes from './NavBar.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars,faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
const NavBarMobile = (props) => {
  const [open,setOpen] = useState(false);

  const hamburger = <FontAwesomeIcon className={`${open?classes.hamburgerActive:classes.hamburger}`} icon={faBars} onClick={()=>{setOpen(true)}}/>

  const close = <FontAwesomeIcon className={`${open?classes.hamburgerActive:classes.hamburger}`} icon={faTimes} onClick={()=>{setOpen(false)}}/>

  return (
    <nav className={classes.navMobile}>
      {open?close:hamburger}
      {open&&<NavLinks calcularComision = {()=>{setOpen(false);props.calcularComision()}} calcularPropina={()=>{setOpen(false);props.calcularPropina()}} calcularJornal={()=>{setOpen(false);props.calcularJornal()}} onClick={()=>{setOpen(false)}}/>}
    </nav>
  );
};

export default NavBarMobile;
