import NavLinks from "./NavLinks";
import classes from './NavBar.module.css';
const NavBarPc = (props) => {
  return (
    <nav className={classes.navPc}>
      <NavLinks onClick={null}/>
    </nav>
  );
};

export default NavBarPc;
