import "./Opciones.css";
import Opcion from "./Opcion";
const Opciones = (props) => {
  const classes = [
    "opciones",
    props.show === "entering"
      ? "abrirOpciones"
      : props.show === "exiting"
      ? "cerrarOpciones"
      : null,
  ];
  return (
    <div style={{maxHeight:`${props.height}em`}} className={classes.join(" ")}>
      <style>{`@keyframes openOpciones{
  0%{
    opacity: 0;
    max-height: 0em;
  }
  80%{
    opacity: 1;
    max-height: ${props.height}em;

  }
  100%{
    opacity: 1;
    max-height: ${props.height}em;
  }
}

@keyframes closeOpciones{
  0%{
    opacity: 1;
    max-height: ${props.height}em;
  }
  50%{
    opacity: 0.8;
    max-height: ${props.height*0.6}em;
  }
  100%{
    opacity: 0;
    max-height: 0em;
  }
}`}</style>
      {props.opciones.map((opcion) => (
        <Opcion onClick={props.mostrar} key={opcion.id} data={opcion} />
      ))}
    </div>
  );
};
export default Opciones;
