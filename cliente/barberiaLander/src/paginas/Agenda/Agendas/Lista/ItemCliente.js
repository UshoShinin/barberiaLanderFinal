import classes from "./ItemCliente.module.css";

const servToText = (s) => {
  switch (s) {
    case 1:
      return "Corte";
    case 4:
      return "Barba";
    case 5:
      return "Máquina";
    case 6:
      return "Claritos";
    case 7:
      return "Decoloración";
    case 8:
      return "Brushing";
  }
};

const Item = (props) => {
  const item = props.item;
  let servicios = item.servicios;
  const primero = servicios[0];
  let textServicios
  if(servicios.length===1){
    textServicios = "Servicios: " +servToText(primero)+'.';
  }else{
    const ultimo = servicios[servicios.length-1];
    textServicios = "Servicios: "+servToText(primero);
    
    for(let i = 1;i<servicios.length-1;i++){
      textServicios += ", " +servToText(servicios[i]);
    }
    textServicios += ' y ' +servToText(ultimo) + ".";
  }
  

  return (
    <li
      className={classes.item}
      onClick={() => {
        props.select(item.idAgenda);
      }}
    >
      <div className={classes.content}>
        <h3>{`${item.fecha}`}</h3>
        <h4>
          Inicio:{item.horaInicio} Fin:{item.horaFin}
        </h4>
        <h4>{item.nombreEmpleado}</h4>
        <p>{textServicios}</p>
        {item.descripcion.length > 0 && (
          <p>
            <span>Descripción:</span> {item.descripcion}
          </p>
        )}
      </div>
    </li>
  );
};
export default Item;
