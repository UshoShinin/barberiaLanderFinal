import SimpleButton from "../../../components/UI/SimpleButton/SimpleButton";
import classes from "./ContenidoCerrarCaja.module.css";
const ContenidoCerrarCaja = (props) => {
  const entradas =props.Cierre.entradas;
  const salidas = props.Cierre.salidas;
  const sinSalidas = salidas.length===1;
  let misSalidas;
  let salida;
  let efectivos = [];
  for(let i = 0; i<entradas.efectivo.length-1;i++){
    efectivos.push(entradas.efectivo[i]);
  }
  const efectivo = entradas.efectivo[entradas.efectivo.length-1];
  let debitos = [];
  for(let i = 0; i<entradas.debito.length-1;i++){
    debitos.push(entradas.debito[i]);
  }
  const debito = entradas.debito[entradas.debito.length-1];
  let cuponeras = [];
  for(let i = 0; i<entradas.cuponera.length-1;i++){
    cuponeras.push(entradas.cuponera[i]);
  }
  const cuponera = entradas.cuponera[entradas.cuponera.length-1];
  
  if(!sinSalidas){
    misSalidas = [];
    for(let i = 0; i<salidas.length-1;i++){
      misSalidas.push(salidas[i]);
    }
    salida = salidas[salidas.length-1];
  }

  return (
    <>
      <div className={`${sinSalidas?classes.containerS:classes.container}`}>
        <div className={classes.efectivos}>
          <h1>Cierre caja</h1>
          <h2>Efectivo</h2>
          <div>
            {efectivos.map((e) => {
              return (
                <>
                  <div className={classes.text}>{`${e.mensaje}: `}</div>
                  <div className={classes.num}>{`$${e.total}`}</div>
                </>
              );
            })}
          </div>
          <h2>Debito</h2>
          <div>
            {debitos.map((e) => {
              return (
                <>
                  <div className={classes.text}>{`${e.mensaje}: `}</div>
                  <div className={classes.num}>{`$${e.total}`}</div>
                </>
              );
            })}
          </div>
          <h2>Cuponera</h2>
          <div>
            {cuponeras.map((e) => {
              return (
                <>
                  <div className={classes.text}>{`${e.mensaje}: `}</div>
                  <div className={classes.num}>{`$${e.total}`}</div>
                </>
              );
            })}
          </div>
          <h2>{`Total Efectivo: ${efectivo.total}`}</h2>
          <h2>{`Total Débito: ${debito.total}`}</h2>
          <h2>{`Total Cuponera: ${cuponera.total}`}</h2>
          
        </div>
        {!sinSalidas&&<div className={classes.salidas}>
          <h2>Salidas</h2>
            <div>
              {misSalidas.map((e) => {
                return (
                  <>
                    <div className={classes.text}>{`${e.nombre}: `}</div>
                    <div className={classes.num}>{`$${e.totalSalidas}`}</div>
                  </>
                );
              })}
            </div>
          <h2>{`Total Salidas: ${salida.total}`}</h2>
        </div>}
      </div>
      <div className={classes.buttons}>
          <SimpleButton color={"red"} action={props.cerrarTodo}>Cierre total</SimpleButton>
      </div>
    </>
  );
};
export default ContenidoCerrarCaja;
