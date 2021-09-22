import classes from "./Mes.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { CSSTransition } from "react-transition-group";
const Mes = (props) => {
  let monthName;
  let classMonth;
  const [show, setShow] = useState(true);
  const [myMonth, setMyMonth] = useState(props.month + 1);
  const min = props.month + 1;
  const max = props.month + props.max;
  const canMoveLeft = myMonth > min;
  const canMoveRight = myMonth < max;
  const [move, setMove] = useState(0);
  const moveLeft = () => {
    if (canMoveLeft) {
      setShow(false);
      setMove(-1);
      props.prev();
    }
  };

  const moveRight = () => {
    if (canMoveRight) {
      setShow(false);
      setMove(1);
      props.next();
    }
  };

  const changeTitle = () => {
    switch (move) {
      case 1:
        setMyMonth((prev) => prev + 1);
        break;
      case -1:
        setMyMonth((prev) => prev - 1);
        break;
      default:
        break;
    }
  };
  switch (myMonth % 12) {
    case 1:
      monthName = "Enero";
      classMonth = classes.Enero;
      break;
    case 2:
      monthName = "Febrero";
      classMonth = classes.Febrero;
      break;
    case 3:
      monthName = "Marzo";
      classMonth = classes.Marzo;
      break;
    case 4:
      monthName = "Abril";
      classMonth = classes.Abril;
      break;
    case 5:
      monthName = "Mayo";
      classMonth = classes.Mayo;
      break;
    case 6:
      monthName = "Junio";
      classMonth = classes.Junio;
      break;
    case 7:
      monthName = "Julio";
      classMonth = classes.Julio;
      break;
    case 8:
      monthName = "Agosto";
      classMonth = classes.Agosto;
      break;
    case 9:
      monthName = "Septiembre";
      classMonth = classes.Septiembre;
      break;
    case 10:
      monthName = "Octubre";
      classMonth = classes.Octubre;
      break;
    case 11:
      monthName = "Noviembre";
      classMonth = classes.Noviembre;
      break;
    case 0:
      monthName = "Diciembre";
      classMonth = classes.Diciembre;
      break;
    default:
      break;
  }
  return (
    <div className={classes.container}>
      <CSSTransition
        in={show}
        timeout={1000}
        onExited={() => {
          setShow(true);
          changeTitle();
        }}
        classNames={{
          enter: "",
          enterActive: `${classes.Open}`,
          exit: "",
          exitActive: `${classes.Close}`,
        }}
      >
        <div className={`${classes.arrowCont} ${classes.I}`}>
          <FontAwesomeIcon
            onClick={moveLeft}
            icon={faAngleLeft}
            className={`${classes.flecha} ${
              !canMoveLeft ? classes.inactive : ""
            }`}
          />
        </div>
      </CSSTransition>
      <div className={`${classMonth} ${!show ? classes.titleClose : ""}`}>
        <h1 className={`${classes.title} `}>{monthName}</h1>
      </div>

      <CSSTransition
        in={show}
        timeout={1000}
        classNames={{
          enter: "",
          enterActive: `${classes.Open}`,
          exit: "",
          exitActive: `${classes.Close}`,
        }}
      >
        <div className={`${classes.arrowCont} ${classes.D}`}>
          <FontAwesomeIcon
            onClick={moveRight}
            icon={faAngleRight}
            className={`${classes.flecha} ${
              !canMoveRight ? classes.inactive : ""
            }`}
          />
        </div>
      </CSSTransition>
    </div>
  );
};

export default Mes;
