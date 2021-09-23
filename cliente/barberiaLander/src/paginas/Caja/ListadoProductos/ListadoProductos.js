import classes from "./ListadoProductos.module.css";
import { getElementById } from "../../../FuncionesAuxiliares/FuncionesAuxiliares";
const ListadoProductos = (props) => {
  
  let lista = [...props.seleccionados];
  const content = props.productos.map((p) => {
    
    const disabled = props.disabled||p.stock<1;
    let pertenece = false;
    if (!disabled) {
      if (getElementById(lista, p.id) !== null) {
        pertenece = true;
        lista.shift();
      }
    }
    return (
      <li
        key={p.id}
        className={`${disabled?classes.liDisabled:pertenece ? classes.active : ''}`}
        onClick={
          !disabled
            ? () => {
                props.onClick(p);
              }
            : null
        }
      >
        {p.nombre}{" "}
        {`${p.stock !== undefined && " X " + p.stock}`}
      </li>
    );
  });
  return <ul className={`${props.disabled?classes.disabled:classes.productos}`}>{content}</ul>;
};
export default ListadoProductos;
