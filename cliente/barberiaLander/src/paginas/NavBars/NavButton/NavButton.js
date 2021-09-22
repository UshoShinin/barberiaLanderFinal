import classes from './NavButton.module.css';
const NavButton = (props) => {
  return (
    <div className={classes.NavButton} onClick={props.onClick}>
      {props.children}
    </div>
  );
};
export default NavButton;
