import classes from "./Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneAlt,
  faMobileAlt,
  faMapMarkedAlt,
  faEnvelope,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import Redes from './RedesSociales/Redes'
/* Este es el footer de la aplicación tiene muchos componente de FontAwesome y
algunos iconos de redes sociales creados con css */
const Footer = () => {
  return (
    <footer className={classes.footer}>
      <h1>Contacto y Horarios</h1>
      <section>
        <div>
          <div className={classes.Elemento}>
            <FontAwesomeIcon icon={faMapMarkedAlt} className={classes.MyIcon} />
            <p>Av. Gral. Rivera 2549</p>
      
            <FontAwesomeIcon icon={faEnvelope} className={classes.MyIcon} />
            <p>barberíalander2549@gmial.com</p>
            <FontAwesomeIcon icon={faClock} className={classes.MyIcon} />
          <p>Lun a Vie 10 a 20hs Sab 10 a 18hs</p>
          <span></span>
          <span></span>
          </div>
        </div>
        <div className={classes.Elemento}>
          <FontAwesomeIcon icon={faPhoneAlt} />
          <p className={classes.PrimerTelefono}>27092659</p>
          <FontAwesomeIcon icon={faMobileAlt} />
          <p>098892879</p>
        </div>
        <div></div>
      </section>
      <Redes />
    </footer>
  );
};
export default Footer;
