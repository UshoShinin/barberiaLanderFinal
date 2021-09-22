import classes from "./Inicio.module.css";
import Slider from "./Slider/Slider";
import Footer from "../../components/Footer/Footer";
import peluqueros from "../../recursos/ImagenesPrueba/peluqueros.JPG";
import Button from "../../components/UI/Button/Button";
import { useHistory } from "react-router-dom";
const Inicio = () => {
  const history = useHistory();
  return (
    <div className={classes.container}>
      <Slider />
      <div className={classes.Contactanos}>
        <figure>
          <img alt='Empleados de la peluquería' src={peluqueros} />
        </figure>
        <div>
          <h1>Reserva online ahora con nosotros</h1>
          <p>
          Barbería Lander es un espacio contemporáneo de peluquería masculina , orientado a entender las inquietudes del hombre de hoy,  para ofrecer el estilo que mejor refleja su personalidad. Nuestro objetivo es lograr que los clientes se sientan satisfechos con todos nuestros servicios.
           Esta empresa fue creada en el año 2015 , con la motivación y ayuda de nuestros amigos y clientes
          </p>
          <Button action={()=>{history.replace('/agenda/crearagenda');}}>Reservar</Button>
        </div>
      </div>
      <div className={classes.footerContainer}>
        <Footer/>
      </div>
    </div>
  );
};

export default Inicio;
