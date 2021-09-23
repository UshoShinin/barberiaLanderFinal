export const formatDate = (date) => {
  const normalDate = date.slice(0, 10);
  const year = normalDate.slice(0, 4);
  const mes = normalDate.slice(5, 7);
  const dia = normalDate.slice(8, 10);
  const nuevaFecha = new Date(`${mes}-${dia}-${year}`);
  return nuevaFecha;
};
export const deFormatDate = (date) => {};

export const calcularPrecio = (servicios) => {
  const servicesList = Object.values(servicios);
  const costoServicios = [
    { id: 1, price: 380 },
    { id: 2, price: 460 },
    { id: 3, price: 400 },
    { id: 4, price: 200 },
    { id: 5, price: 220 },
    { id: 6, price: 900 },
    { id: 7, price: 1500 },
    { id: 8, price: 800 },
  ]
  let total = 0;
  let ignorar;
  servicesList.forEach((ser) => {
    if (ser.active && ser.id !== ignorar) {
      if (ser.id === 1 && servicesList[1].active) {
        ignorar = servicesList[1].id;
        total += getElementById(costoServicios, 2).price;
      } else if (ser.id === 4 && servicesList[2].active) {
        ignorar = servicesList[2].id;
        total += getElementById(costoServicios, 3).price;
      } else {
        total += getElementById(costoServicios, ser.id).price;
      }
    }
  });
  return total;
};

export const validarMonto = (value) => {
  let largo = (value === ""||value === 0)?0:value.trim().length;
  if(value === ""||  largo=== 0|| largo > 6) return false;
  for(let i = 0;i<largo;i++){
    if(value.charCodeAt(i)<48||value.charCodeAt(i)>57) return false;
  }
  return parseInt(value,10) > 0;
};

export const validarMontoPermitirNulos = (value) => {
  return ((value !== ""&&value!==0 ? value.trim().length > 0 : null) && parseInt(value) >= 0);
};

export const validarCedula = (value,ex) =>{
  let ced = value.trim();
  if (ex !== undefined && ced) return null;
  if(ced===''||ced.length<7 || ced.length>8) return false;
  for(let i = 0;i<ced.length;i++){
    if(ced.charCodeAt(i)<48||ced.charCodeAt(i)>57) return false;
  }
  let total = 0;
  let aux;
  let multiplos;
  let ultimo = ced.slice(-1);
  ced = ced.slice(0,-1);
  if(ced.length===7)multiplos = [2,9,8,7,6,3,4];
  else multiplos = [9,8,7,6,3,4];
  for(let i = 0;i<ced.length;i++){
    let num = ced.charAt(i) * multiplos[i]
    total += num;
  }
  aux = total % 10;
  total = 10 -aux;
  return ultimo === String(total);
}

/* Este metodo está obtener el equivalente en el state de un id de empleado */
export const getElementById = (list, id) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) return list[i];
  }
  return null;
};

export const comparaFechas = (dia,mes,year,fecha)=>{
  let myYear = parseInt(fecha.substring(0,4),10);
  let miMes = parseInt(fecha.substring(5,7),10);
  let miDia = parseInt(fecha.substring(8,10),10);
  return (myYear<year||miMes<mes||miDia<dia);
}


