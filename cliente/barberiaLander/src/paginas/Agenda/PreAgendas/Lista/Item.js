import classes from "./Item.module.css";
import SimpleButton from "../../../../components/UI/SimpleButton/SimpleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
const Item = (props) => {
  const item = props.item;
  return (
    <li className={classes.item}>
      <div className={classes.content}>
        <h3>{item.nombreCliente}</h3>
        <h4>
          Inicio:{item.horaInicio} Fin:{item.horaFin}
        </h4>
        <h4>{item.nombreEmpleado}</h4>
        {item.descripcion.length > 0 && (
          <p>
            <span>Descripción:</span> {item.descripcion}
          </p>
        )}
      </div>
      <div className={classes.contentBotones}>
        <SimpleButton
        className={classes.accept}
          action={() => {
            props.aceptar({
              idAgenda: item.idAgenda,
              ciEmpleado: item.ciEmpleado,
              horario: { i: item.horaInicio, f: item.horaFin },
              fecha: item.fecha,
            });
          }}
        >
          <FontAwesomeIcon icon={faCheck} />
        </SimpleButton>
        <SimpleButton
        className={classes.deny}
          color="red"
          action={() => {
            props.rechazar({
              idAgenda: item.idAgenda,
              idHorario: item.idHorario,
            });
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </SimpleButton>
        <div className={classes.info}>
          <SimpleButton
            color="white"
            action={() => {
              props.select(item.idAgenda);
            }}
          >
            <FontAwesomeIcon icon={faSearch} />
          </SimpleButton>
        </div>
      </div>
    </li>
  );
};
export default Item;
