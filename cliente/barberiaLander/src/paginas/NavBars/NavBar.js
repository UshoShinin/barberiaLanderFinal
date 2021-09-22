import NavBarMobile from "./NavBarMobile";
import NavBarPc from "./NavBarPc";
import classes from './NavBar.module.css';

const Navbar = () => {

  return <div className={classes.NavBar}>
    <NavBarMobile/>
    <NavBarPc/>
  </div>;
};
export default Navbar;
