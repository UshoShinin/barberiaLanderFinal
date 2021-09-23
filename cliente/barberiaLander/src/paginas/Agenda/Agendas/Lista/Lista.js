import Item from "./Item";
import ItemCliente from "./ItemCliente";
import classes from "./Lista.module.css";
const Lista = (props) => {
  const Cli = props.cliente;
  const content = props.items.map((item) => {
    if (Cli) {
      return (
        <ItemCliente
          key={item.idAgenda}
          item={item}
          select={props.select}
        />
      );
    } else {
      return (
        <Item
          key={item.idAgenda}
          item={item}
          select={props.select}
          aceptar={props.aceptar}
          rechazar={props.rechazar}
        />
      );
    }
  });
  return <ul className={classes.lista}>{content}</ul>;
};
export default Lista;
