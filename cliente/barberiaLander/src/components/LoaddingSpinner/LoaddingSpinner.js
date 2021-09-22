import classes from "./LoaddingSpinner.module.css";
import Marco from "../UI/Marco/Marco";
/* Este es el logo que debe aparecer siempre mientras se están realizando las consultas a la api */
const LoaddingSpinner = () => {
  return (
    <Marco className={classes.alinear}>
      <div className={classes.loader}></div>
    </Marco>
  );
};
export default LoaddingSpinner;
