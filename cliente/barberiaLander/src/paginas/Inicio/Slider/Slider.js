import classes from "./Slider.module.css";
import classesAnim from "./Animations.module.css";
import one from "../../../recursos/ImagenesPrueba/1.jpg";
import two from "../../../recursos/ImagenesPrueba/2.jpg";
import three from "../../../recursos/ImagenesPrueba/3.jpg";
import four from "../../../recursos/ImagenesPrueba/4.jpg";
import five from "../../../recursos/ImagenesPrueba/5.jpg";
import six from "../../../recursos/ImagenesPrueba/6.jpg";
import seven from "../../../recursos/ImagenesPrueba/7.jpg";
import eight from "../../../recursos/ImagenesPrueba/8.jpg";
import nine from "../../../recursos/ImagenesPrueba/9.jpg";
import ten from "../../../recursos/ImagenesPrueba/10.jpg";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useReducer } from "react";
const Slider = (props) => {
  const autoMove = () => {
    dispatch({ type: "RIGHT" });
  };
  useEffect(() => {
    /* clearTimeout();
    setTimeout(autoMove, 5000); */
  }, []);
  const imagenes = [one, two, three, four, five, six, seven,eight,nine,ten];
  let posiciones = [];
  for (let i = 0; i < imagenes.length; i++) {
    posiciones.push(i);
  }
  const initialState = {
    posiciones: [...posiciones],
    imagenes: [...imagenes],
    movimiento: 0,
    A: { value: 0, active: true },
    B: { value: 0, active: false },
  };
  const reducer = (state, action) => {
    let newB;
    switch (action.type) {
      case "RIGHT": {
        newB = state.A.value + 1;
        newB = newB === state.imagenes.length ? 0 : newB;
        return {
          ...state,
          movimiento: 1,
          A: { ...state.A, active: false },
          B: { value: newB, active: true },
        };
      }
      case "LEFT": {
        newB = state.A.value - 1;
        newB = newB < 0 ? state.imagenes.length - 1 : newB;
        return {
          ...state,
          movimiento: -1,
          A: { ...state.A, active: false },
          B: { value: newB, active: true },
        };
      }
      case "ACTUALIZAR": {
        return {
          ...state,
          movimiento: 0,
          A: { value: state.B.value, active: true },
          B: { ...state.B, active: false },
        };
      }
      case "JUMP": {
        if (state.A.value === action.value) return { ...state };
        const movimiento = state.A.value < action.value ? 1 : -1;
        newB = action.value;
        return {
          ...state,
          movimiento: movimiento,
          A: { ...state.A, active: false },
          B: { value: newB, active: true },
        };
      }
      default:
        return{...state}
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className={classes.Slider}>
      <button
        onClick={
          state.movimiento === 0
            ? () => {
                dispatch({ type: "LEFT" });
              }
            : null
        }
        className={classes.Left}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        onClick={
          state.movimiento === 0
            ? () => {
                dispatch({ type: "RIGHT" });
              }
            : null
        }
        className={classes.Right}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
      <div className={classes.Content}>
        <CSSTransition
          in={state.A.active}
          timeout={1400}
          classNames={{
            enter: "",
            enterActive: "",
            exit: "",
            exitActive: `${
              state.movimiento > 0
                ? classesAnim.rightEnter
                : classesAnim.leftEnterA
            }`,
          }}
          onExited={() => {
            dispatch({ type: "ACTUALIZAR" });
            /* clearTimeout();
            setTimeout(autoMove, 5000); */
          }}
        >
          <img src={state.imagenes[state.A.value]} />
        </CSSTransition>
        <CSSTransition
          in={state.B.active}
          timeout={1400}
          classNames={{
            enter: "",
            enterActive: `${
              state.movimiento > 0
                ? classesAnim.rightEnter
                : classesAnim.leftEnterB
            }`,
            exit: "",
            exitActive: "",
          }}
        >
          <img src={state.imagenes[state.B.value]} />
        </CSSTransition>
      </div>
      <div className={classes.miniNav}>
        {state.posiciones.map((p) => (
          <div
            onClick={
              state.movimiento === 0
                ? () => {
                    dispatch({ type: "JUMP", value: p });
                  }
                : null
            }
            key={p}
            className={`${
              p === state.B.value ? classes.active : classes.point
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
