import { useState } from "react";
import classes from "./Redes.module.css";
import classesFace from "./Face.module.css";
import classesInsta from "./Insta.module.css";
import classesWhat from "./Whatsapp.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
const Redes = () => {
  /* Este componente gestiona los estados de los iconoes de las redes sociales, como todos solo tienen un estado de
  prendido o apagado me pareció apropiado manejalos con useState */
  const [faceActive, setFaceActive] = useState(false);
  const [instaActive, setInstaActive] = useState(false);
  const [whatActive, setWhatActive] = useState(false);

  const MouseOverFaceHandler = () => {
    setFaceActive(true);
  };
  const MouseOutFaceHandler = () => {
    setFaceActive(false);
  };
  const redirectToFace = () => {
    window.location.href = "https://m.facebook.com/landerpeluqueria";
  };
  const MouseOverInstaHandler = () => {
    setInstaActive(true);
  };
  const MouseOutInstaHandler = () => {
    setInstaActive(false);
  };

  const redirectToInsta = () => {
    window.location.href = "https://www.instagram.com/barberialander/";
  };
  const MouseOverWhatsaHandler = () => {
    setWhatActive(true);
  };
  const MouseOutWhatsaHandler = () => {
    setWhatActive(false);
  };

  const redirectToWasa = () => {
    window.location.href = "https://api.whatsapp.com/send?phone=+59898892879";
  };
  return (
    <ul className={classes.redes}>
      <li
        className={`${classes.Elemento} ${
          faceActive ? classes.ElementoActiveFace : ""
        }`}
        onMouseEnter={MouseOverFaceHandler}
        onMouseLeave={MouseOutFaceHandler}
      >
        <div
          onClick={redirectToFace}
          className={`${classesFace.Facebook} ${
            faceActive ? classesFace.FacebookActive : ""
          }`}
        >
          <span
            className={`${classesFace.vertical} ${
              faceActive ? classesFace.verticalActive : ""
            }`}
          ></span>
          <span
            className={`${classesFace.horizontal} ${
              faceActive ? classesFace.horizontalActive : ""
            }`}
          ></span>
          <span
            className={`${classesFace.diagonal} ${
              faceActive ? classesFace.diagonalActive : ""
            }`}
          ></span>
          <span
            className={`${classesFace.diagonal2} ${
              faceActive ? classesFace.diagonal2Active : ""
            }`}
          ></span>
        </div>
      </li>
      <li
        className={`${classes.ElementoInsta} ${
          instaActive ? classes.ElementoActiveInsta : ""
        }`}
        onMouseEnter={MouseOverInstaHandler}
        onMouseLeave={MouseOutInstaHandler}
      >
        <div
          onClick={redirectToInsta}
          className={`${classesInsta.Instagram} ${
            instaActive ? classesInsta.InstagramActive : ""
          }`}
        >
          <div
            className={`${classesInsta.InstaFondo} ${
              instaActive ? classesInsta.InstaFondoActive : ""
            }`}
          ></div>
          <span
            className={`${classesInsta.Point} ${
              instaActive ? classesInsta.PointActive : ""
            }`}
          ></span>
        </div>
      </li>
      <li
        className={`${classes.Elemento} ${
          whatActive ? classes.ElementoActiveWasa : ""
        }`}
        onMouseEnter={MouseOverWhatsaHandler}
        onMouseLeave={MouseOutWhatsaHandler}
      >
        <FontAwesomeIcon
          onClick={redirectToWasa}
          icon={faWhatsapp}
          className={`${classesWhat.Icon} ${
            whatActive ? classesWhat.IconActive : ""
          }`}
        />
      </li>
    </ul>
  );
};
export default Redes;
