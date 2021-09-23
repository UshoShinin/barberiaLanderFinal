//Importo la conexion
const conexion = require("./conexion");
//Importo el paquete que vamos a usar
const sql = require("mssql");

//Aceptar una agenda
const aceptarAgenda = async (id, horario) => {
  try {
    //Verifico que el horario siga estando disponible
    const horarioDisponible = verificarHorario({
      ciEmpleado: horario.ciEmpleado,
      i: horario.horario.i,
      f: horario.horario.f,
      fecha: horario.fecha,
    }).then(async (disponible) => {
      if (!disponible) {
        return {
          codigo: 400,
          mensaje: "El horario ya esta ocupado",
        };
      } else {
        //Creo la conexion
        let pool = await sql.connect(conexion);
        //Hago la query para conseguir la agenda
        let queryAgenda = "Select Aceptada from Agenda where IdAgenda = " + id;
        //Voy a buscar si esta aceptada la agenda
        let agenda = await pool.request().query(queryAgenda);
        //Si la agenda esta aceptada devuelvo eso
        if (agenda.recordset[0].Aceptada) {
          let ret = {
            codigo: 401,
            mensaje: "La agenda ya fue aceptada previamente",
          };
          return ret;
        } else {
          //Hago la query del update
          let queryUpdate =
            "update Agenda set Aceptada = 1 where IdAgenda = " + id;
          //Hago update de la agenda
          let empleados = await pool.request().query(queryUpdate);
          //Si salio todo bien y no fue al catch se confirma de que fue aceptada
          let ret = {
            codigo: 200,
            mensaje: "La agenda fue aceptada",
          };
          return ret;
        }
      }
    });
    return horarioDisponible;
  } catch (error) {
    //Mensaje de error en caso de que haya pasado algo
    let ret = {
      codigo: 400,
      mensaje: "Error al aceptarla",
    };
    console.log(error);
    return ret;
  }
};
//Metodo para rechazar/cancelar una agenda
const cancelarAgenda = async (idAgenda, idHorario) => {
  try {
    //Llamo al metodo que elimina todos los datos
    const resultado = eliminarDatosAgenda(idAgenda, idHorario).then(
      (mensaje) => mensaje
    );
    return resultado;
  } catch (error) {
    console.log(error);
  }
};
//Metodo auxiliar que llama a los metodos de eliminar individuales
const eliminarDatosAgenda = async (idAgenda, idHorario) => {
  try {
    //Aca hago las llamadas a todos los metodos individuales
    return eliminarServicioAgendaPorIdAgenda(idAgenda)
      .then((serviciosBorrados) => {
        //Aca llamo al eliminar los datos de la agenda (HAY QUE VER EL TEMA DE ELIMINAR LA AGENDA DE UN CLIENTE)
        if (serviciosBorrados < 0) {
          return { codigo: 400, mensaje: "Error al eliminar los servicios" };
        }
        return eliminarAgenda(idAgenda);
      })
      .then((agendaEliminada) => {
        if (agendaEliminada < 0) {
          return { codigo: 400, mensaje: "Error al eliminar la agenda" };
        }
        return eliminarAgendaCliente(idAgenda);
      })
      .then((agendaClienteEliminada) => {
        //Aca se deberia verificar de que se haya eliminado la agenda del cliente pero no es necesario
        return eliminarHorario(idHorario);
      })
      .then((horarioEliminado) => {
        if (horarioEliminado < 0) {
          return { codigo: 400, mensaje: "Error al eliminar el horario" };
        }
        return { codigo: 200, mensaje: "Agenda eliminada correctamente" };
      });
  } catch (error) {
    console.log(error);
  }
};
//Metodo para eliminar de la tabla Agenda
const eliminarAgenda = async (idAgenda) => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Hago el delete de la agenda
    const deleteAgenda = await pool
      .request()
      .input("idAgenda", sql.Int, idAgenda)
      .query("delete from Agenda where IdAgenda = @idAgenda");
    //Separo la cantidad de filas afectadas
    const filasAfectadas = deleteAgenda.rowsAffected;
    //Devuelvo la cantidad de filas afectadas
    return filasAfectadas;
  } catch (error) {
    console.log(error);
  }
};
//Metodo para eliminar de la tabla Horario
const eliminarHorario = async (idHorario) => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Hago el delete del horario
    const deleteHorario = await pool
      .request()
      .input("idHorario", sql.Int, idHorario)
      .query("delete from Horario where IdHorario = @idHorario");
    //Separo la cantidad de filas afectadas
    const filasAfectadas = deleteHorario.rowsAffected;
    //Devuelvo la cantidad de filas afectadas
    return filasAfectadas;
  } catch (error) {
    console.log(error);
  }
};
//Metodo auxiliar para eliminar de la tabla AgendaCliente
const eliminarAgendaCliente = async (idAgenda) => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Hago el delete de la agenda
    const deleteAgendaCliente = await pool
      .request()
      .input("idAgenda", sql.Int, idAgenda)
      .query("delete from Agenda_Cliente where IdAgenda = @idAgenda");
    //Separo la cantidad de filas afectadas
    const filasAfectadas = deleteAgendaCliente.rowsAffected;
    //Devuelvo la cantidad de filas afectadas
    return filasAfectadas;
  } catch (error) {
    console.log(error);
  }
};
//Conseguir datos para el listado de agendas
const getDatosListadoAgendas = async () => {
  //variable que tiene la conexion
  let pool = await sql.connect(conexion);
  //Voy a buscar los nombres de los empleados
  let consultaNombreEmpleados = await pool
    .request()
    .query("select Cedula, Nombre from Empleado");
  //Voy a buscar los datos que me interesan de las agendas
  let consultaAgendas = await pool
    .request()
    .query(
      "select A.IdAgenda, H.Cedula, H.HoraInicio, H.HoraFin from Agenda A, Horario H where A.IdHorario = H.IdHorario and A.Aceptada = 1 and H.Fecha = CONVERT(date, getdate()) order by H.Cedula, H.HoraInicio"
    );
  //Dejo armado un array con los datos de las agendas
  let agendas = consultaAgendas.recordset;
  //Dejo armado un array con los empleados
  let nombreEmpleados = consultaNombreEmpleados.recordset;
  //Armo el objeto que voy a devolver
  let ret = {
    agendas: [],
  };
  //Recorro los empleados para armar los objetos que necesito pushear al array que devuelvo
  for (let i = 0; i < nombreEmpleados.length; i++) {
    //Armo el objeto con los datos del empleado
    let empleadoAux = {
      ci: nombreEmpleados[i].Cedula,
      nombreEmpleado: nombreEmpleados[i].Nombre,
      agendas: [],
    };
    //Recorro las agendas para agregarle los datos de ellas al objeto empleadoAux
    for (let j = 0; j < agendas.length; j++) {
      //Verifico de si la agenda corresponde al empleado en el cual estoy parado
      if (agendas[j].Cedula == nombreEmpleados[i].Cedula) {
        //Creo un objeto agenda para pushear al listado de agendas del empleado
        let agendaAux = {
          idAgenda: agendas[j].IdAgenda,
          i: agendas[j].HoraInicio,
          f: agendas[j].HoraFin,
        };
        //Agrego la agenda al array de agendas del empleado seleccionado
        empleadoAux.agendas.push(agendaAux);
      }
    }
    //Agrego el empleado al array que se va a devolver
    ret.agendas.push(empleadoAux);
  }
  //Devuelvo el objeto ret
  return ret;
};

//Metodo para conseguir todos los servicios con su nombre
//Esto devuelve una promesa con todos los servicios
const getServicios = async () => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Consigo el listado de servicios
    const listadoServicios = await pool
      .request()
      .query("select * from Servicio");
    //Armo un array que es lo que voy a devolver
    let arrayRetorno = [];
    //Recorro el listado de servicios y agrego al array de retorno los servicios
    //Agrego los servicios al array de retorno
    for (let u = 0; u < listadoServicios.recordset.length; u++) {
      let servicioAux = {
        id: listadoServicios.recordset[u].IdServicio,
        nombre: listadoServicios.recordset[u].Nombre,
        precio: listadoServicios.recordset[u].Precio,
      };
      arrayRetorno.push(servicioAux);
    }
    return arrayRetorno;
  } catch (error) {
    console.log(error);
  }
};
//Metodo para conseguir los empleados para el formulario
//Devuelve una promesa
const getEmpleadosFormulario = async () => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Consigo los datos de los empleados
    const empleados = await pool
      .request()
      .query("select Cedula, Nombre, Img from Empleado where Habilitado = 1");
    //Creo el array de retorno
    let arrayRetorno = [];
    //Recorro el listado de empleados para armar el objeto como necesito
    for (let i = 0; i < empleados.recordset.length; i++) {
      //Creo un empleado auxiliar para agregar al array de retorno
      let empleadoAux = {
        id: empleados.recordset[i].Cedula,
        title: empleados.recordset[i].Nombre,
        foto: empleados.recordset[i].Img,
        jornada: [],
      };
      arrayRetorno.push(empleadoAux);
    }
    return agregarJornadaListadoEmpleados(arrayRetorno).then((arrayEntero) => {
      //Mezclo el array para que sea al azar el empleado que te muestra primero
      let arrayRetorno = arrayEntero;
      arrayRetorno.sort(function () {
        return Math.random() - 0.5;
      });
      return arrayRetorno;
    });
  } catch (error) {
    console.log(error);
  }
};
//Metodo auxiliar para agregarle la jornada a los empleados
const agregarJornadaListadoEmpleados = async (listadoEmpleados) => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Consigo las jornadas de todos los empleados
    const jornadas = await pool
      .request()
      .query("select * from JornadaEmpleado");
    //Armo el array completo que voy a devolver
    let arrayRetorno = listadoEmpleados;
    //Recorro todos los empleados para ir agregando sus jornadas
    for (let i = 0; i < arrayRetorno.length; i++) {
      for (let k = 0; k < jornadas.recordset.length; k++) {
        if (arrayRetorno[i].id === jornadas.recordset[k].Cedula) {
          //Cuando coincide la cedula entonces armo un obj axuiliar para agregar a las jornadas del empleado
          let aux = {
            id: jornadas.recordset[k].Dia,
            entrada: jornadas.recordset[k].HorarioEntrada,
            salida: jornadas.recordset[k].HorarioSalida,
          };
          arrayRetorno[i].jornada.push(aux);
        }
      }
    }
    return arrayRetorno;
  } catch (error) {
    console.log(error);
  }
};
//Metodo para agregarle a los empleados del formulario lo que duran con cada servicio
//Nada mas espero que me llegue un array con objetos empleado
//Devuelve una promesa
const agregarDuracionEmpleados = async (listadoEmpleados) => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Consigo cuanto demora cada empleado por servicio
    const duracionServiciosEmpleado = await pool
      .request()
      .query(
        "select E.Cedula, SE.IdServicio, SE.Duracion from Empleado E, Servicio_Empleado SE where E.Cedula = SE.Cedula order by E.Cedula, SE.IdServicio"
      );
    let arrayRetorno = [];
    for (let i = 0; i < listadoEmpleados.length; i++) {
      //Creo empleado auxiliar para agregarle duracion
      let empleadoAux = {
        ...listadoEmpleados[i],
        duracion: [],
      };
      //Recorro las duraciones de servicios para ir agregandolo aca
      for (let p = 0; p < duracionServiciosEmpleado.recordset.length; p++) {
        if (duracionServiciosEmpleado.recordset[p].Cedula === empleadoAux.id) {
          //Creo un objeto auxiliar para agregar al empleadoAux
          let duracionAux = {
            idServicio: duracionServiciosEmpleado.recordset[p].IdServicio,
            duracion: duracionServiciosEmpleado.recordset[p].Duracion,
          };
          empleadoAux.duracion.push(duracionAux);
        }
      }
      arrayRetorno.push(empleadoAux);
    }
    return arrayRetorno;
  } catch (error) {
    console.log(error);
  }
};
//Metodo para agregarle las fechas agendadas a los
//Espero que me llegue un listado de empleados
//Devuelve una promesa
const agregarFechasEmpleados = async (listadoEmpleados) => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Voy a buscar las fechas de todas las agendas aceptadas
    const fechasAgenda = await pool
      .request()
      .query(
        "select E.Cedula, H.Fecha from Empleado E, Agenda A, Horario H where E.Cedula = H.Cedula and A.IdHorario = H.IdHorario and A.Aceptada = 1 group by H.Fecha, E.Cedula"
      );
    //Armo el array de retorno
    let arrayRetorno = [];
    //Recorro todos los empleados y por cada uno le agrego las fechas de las agendas
    for (let i = 0; i < listadoEmpleados.length; i++) {
      //Armo un empleado aux que tiene un array de fechas
      let empleadoAux = {
        ...listadoEmpleados[i],
        fechas: [],
      };
      //Recorro las fechas de las agendas para agregarlas
      for (let j = 0; j < fechasAgenda.recordset.length; j++) {
        if (empleadoAux.id === fechasAgenda.recordset[j].Cedula) {
          //Creo el objeto fecha para agregar al empleado
          let fechaAux = {
            dia: fechasAgenda.recordset[j].Fecha.getUTCDate(),
            mes: fechasAgenda.recordset[j].Fecha.getMonth() + 1,
            horarios: [],
          };
          empleadoAux.fechas.push(fechaAux);
        }
      }
      arrayRetorno.push(empleadoAux);
    }
    return arrayRetorno;
  } catch (error) {
    console.log(error);
  }
};
//Metodo para agregar los horarios de las agendas al empleado
//Me llega un empleado y le tengo que agregar los horarios a ese empleado
//Devuelve una promesa
const agregarHorariosEmpleado = async (listadoEmpleados) => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Consigo los datos de los horarios
    const horarios = await pool
      .request()
      .query(
        "select H.IdHorario, H.Cedula, H.HoraInicio, H.HoraFin, H.Fecha from Horario H, Agenda A where H.IdHorario = A.IdHorario and A.Aceptada = 1 order by Cedula, HoraInicio"
      );
    //Recorro todos los empleados para ir agregando uno por uno sus horarios
    for (let k = 0; k < listadoEmpleados.length; k++) {
      //Recorro las fechas del empleado en el cual estoy parado
      for (let j = 0; j < listadoEmpleados[k].fechas.length; j++) {
        //Recorro el array de horarios para ver cuales le tengo que asignar
        for (let i = 0; i < horarios.recordset.length; i++) {
          //Tengo que verificar de que la fecha del horario sea la fecha correspondiente
          if (
            listadoEmpleados[k].fechas[j].dia ===
              horarios.recordset[i].Fecha.getUTCDate() &&
            listadoEmpleados[k].fechas[j].mes ===
              horarios.recordset[i].Fecha.getMonth() + 1 &&
            horarios.recordset[i].Cedula == listadoEmpleados[k].id
          ) {
            //Creo objeto auxiliar horario para agregar
            let horarioAux = {
              i: horarios.recordset[i].HoraInicio,
              f: horarios.recordset[i].HoraFin,
            };
            listadoEmpleados[k].fechas[j].horarios.push(horarioAux);
          }
        }
      }
    }
    return listadoEmpleados;
  } catch (error) {
    console.log(error);
  }
};
//Metodo para agregar los servicios al array que devuelvo
//Devuelvo una promesa
const agregarServiciosRetorno = async (listado) => {
  let retorno = getServicios().then((resultado) => {
    //Armo el array entero con todo
    let objetoRetorno = {
      servicios: resultado,
      empleados: [...listado],
    };
    return objetoRetorno;
  });
  return retorno;
};
//Agregar el manejo de agendas al array que devuelvo
const agregarManejoAgendas = async (listado) => {
  let retorno = getManejoAgendas().then((resultado) => {
    //Armo el array entero con todo
    let objetoRetorno = {
      ...listado,
      manejoAgenda: resultado,
    };
    return objetoRetorno;
  });
  return retorno;
};
//Metodo auxiliar para conseguir el manejo de agendas
const getManejoAgendas = async () => {
  //variable que tiene la conexion
  const pool = await sql.connect(conexion);
  //Consigo el listado de servicios
  const manejoAgenda = await pool
    .request()
    .query("select * from ManejarAgendas");
  return manejoAgenda.recordset[0];
};
//Conseguir datos para formularios
const getDatosFormulario = async () => {
  return getEmpleadosFormulario()
    .then((listadoEmpleados) => {
      return agregarDuracionEmpleados(listadoEmpleados);
    })
    .then((listadoEmpleadosDuracion) => {
      return agregarFechasEmpleados(listadoEmpleadosDuracion);
    })
    .then((listadoEmpleadosConFecha) => {
      return agregarHorariosEmpleado(listadoEmpleadosConFecha);
    })
    .then((listadoCompleto) => {
      return agregarServiciosRetorno(listadoCompleto);
    })
    .then((listadoConServicios) => {
      return agregarManejoAgendas(listadoConServicios);
    })
    .then((listadoCompleto) => listadoCompleto);
};

//Conseguir datos de todas las pre agendas
const getPreAgendas = async () => {
  //Variable donde esta la conexion con la bd
  const pool = await sql.connect(conexion);
  //Aca guardo el resultado de la consulta a la bd
  const consultaPreAgendas = await pool
    .request()
    .query(
      "select A.IdAgenda, H.Fecha, A.NombreCliente, H.HoraInicio, H.HoraFin, A.Descripcion, H.Cedula, E.Nombre, A.IdHorario from Agenda A, Horario H, Empleado E where A.IdHorario = H.IdHorario and A.Aceptada = 0 and H.Cedula = E.Cedula"
    );
  //Separo las preagendas de los resultados de la consulta
  const preAgendas = consultaPreAgendas.recordset;
  //Creo objeto de retorno
  let ret = {
    preAgendas: [],
  };
  //Recorro las preagendas y las agrego al array de retorno
  for (let i = 0; i < preAgendas.length; i++) {
    //Creo la preagenda que agrego al array de retorno
    let preAgendaAux = {
      idAgenda: preAgendas[i].IdAgenda,
      idHorario: preAgendas[i].IdHorario,
      ciEmpleado: preAgendas[i].Cedula,
      nombreEmpleado: preAgendas[i].Nombre,
      fecha: preAgendas[i].Fecha,
      nombreCliente: preAgendas[i].NombreCliente,
      horaInicio: preAgendas[i].HoraInicio,
      horaFin: preAgendas[i].HoraFin,
      descripcion: preAgendas[i].Descripcion,
    };
    //Empujo la preagenda al array de retorno
    ret.preAgendas.push(preAgendaAux);
  }
  return ret;
};

//Conseguir datos de todas las  agendas
const getAgendas = async () => {
  //Variable donde esta la conexion con la bd
  const pool = await sql.connect(conexion);
  //Aca guardo el resultado de la consulta a la bd
  const consultaPreAgendas = await pool
    .request()
    .query(
      "select A.IdAgenda, H.Fecha, A.NombreCliente, H.HoraInicio, H.HoraFin, A.Descripcion, H.Cedula, E.Nombre, A.IdHorario from Agenda A, Horario H, Empleado E where A.IdHorario = H.IdHorario and A.Aceptada = 1 and H.Cedula = E.Cedula"
    );
  //Separo las preagendas de los resultados de la consulta
  const preAgendas = consultaPreAgendas.recordset;
  //Creo objeto de retorno
  let ret = {
    preAgendas: [],
  };
  //Recorro las preagendas y las agrego al array de retorno
  for (let i = 0; i < preAgendas.length; i++) {
    //Creo la preagenda que agrego al array de retorno
    let preAgendaAux = {
      idAgenda: preAgendas[i].IdAgenda,
      idHorario: preAgendas[i].IdHorario,
      ciEmpleado: preAgendas[i].Cedula,
      nombreEmpleado: preAgendas[i].Nombre,
      fecha: preAgendas[i].Fecha,
      nombreCliente: preAgendas[i].NombreCliente,
      horaInicio: preAgendas[i].HoraInicio,
      horaFin: preAgendas[i].HoraFin,
      descripcion: preAgendas[i].Descripcion,
    };
    //Empujo la preagenda al array de retorno
    ret.preAgendas.push(preAgendaAux);
  }
  return ret;
};

//Metodo para devolver los datos para el listado de preagendas
const datosListadoAgendas = async () => {
  try {
    return getAgendas()
      .then((listado) => {
        return agregarManejoAgendas(listado);
      })
      .then((listadoAgendas) => listadoAgendas);
  } catch (error) {
    console.log();
  }
};

//Metodo para devolver los datos para el listado de preagendas
const datosListadoPreagendas = async () => {
  try {
    return getPreAgendas()
      .then((listado) => {
        return agregarManejoAgendas(listado);
      })
      .then((listadoPreagendas) => listadoPreagendas);
  } catch (error) {
    console.log();
  }
};

//Conseguir los datos de una agenda por su id
const getAgendaPorId = async (idAgenda) => {
  try {
    //Variable donde esta la conexion con la bd
    const pool = await sql.connect(conexion);
    //Armo la query
    let query =
      "select A.IdAgenda, A.NombreCliente, A.Descripcion, A.Img, A.Tel, E.Nombre, H.Cedula, H.HoraInicio, H.HoraFin, H.Fecha, H.IdHorario from Agenda A, Horario H, Empleado E where A.IdHorario = H.IdHorario and E.Cedula = H.Cedula and A.IdAgenda = " +
      idAgenda;
    //Aca guardo el resultado de la consulta a la bd
    const consultaAgendaPorId = await pool.request().query(query);
    //Verifico que haya una agenda
    if (consultaAgendaPorId.rowsAffected[0] === 1) {
      //Separo el resultado
      let agenda = consultaAgendaPorId.recordset;
      //Armo el objeto de retorno para poder agregarle todos los servicios de la agenda
      let ret = {
        idagenda: agenda[0].IdAgenda,
        nombreCliente: agenda[0].NombreCliente,
        descripcion: agenda[0].Descripcion,
        img: agenda[0].Img,
        tel: agenda[0].Tel,
        nombreEmpleado: agenda[0].Nombre,
        ciPeluquero: agenda[0].Cedula,
        horario: { i: agenda[0].HoraInicio, f: agenda[0].HoraFin },
        fecha: agenda[0].Fecha,
        servicios: [],
        idHorario: agenda[0].IdHorario,
      };
      //Armo la query para buscar todos los servicios de la agenda
      let queryServicios =
        "select IdServicio from Agenda_Servicio where IdAgenda = " + idAgenda;
      //Hago la consulta a la bd
      const consultaServiciosAgenda = await pool
        .request()
        .query(queryServicios);
      //Separo el resultado
      const serviciosAgenda = consultaServiciosAgenda.recordset;
      //Por cada horario que haya en serviciosAgenda lo agrego al array de retorno
      serviciosAgenda.forEach((servicio) => {
        ret.servicios.push(servicio.IdServicio);
      });
      return { codigo: 200, mensaje: ret };
    } else {
      return { codigo: 400, mensaje: "No existe una agenda con ese id" };
    }
  } catch (error) {
    console.log(error);
    return { codigo: 400, mensaje: "Error al buscar agenda" };
  }
};

//Metodo auxiliar para verificar que un horario siga disponible
//Este metodo es utilizado para verificar el horario al momento de aceptar una agenda y crearla
//Devuelve una promesa con true o false
const verificarHorario = async (horario) => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Voy a buscar todos los horarios del empleado que me mandaron
    const horarios = await pool
      .request()
      .input("ci", sql.VarChar, horario.ciEmpleado)
      .input("fecha", sql.Date, horario.fecha)
      .query(
        "select HoraInicio, HoraFin from Horario H, Agenda A where Cedula = @ci and Fecha = @fecha and A.IdHorario = H.IdHorario and A.Aceptada = 1"
      );
    //Separo el listado
    const lista = horarios.recordset;
    //Paso a valores numericos los datos del horario que me pasan por parametro para poder trabajar mejor
    let horaInicio = parseInt(horario.i.replace(":", ""));
    let horaFin = parseInt(horario.f.replace(":", ""));
    //Esta variable es la que devuelvo al final, arranca en true y en el for se evalua para pasar a false
    let puedoInsertar = true;
    //Recorro los horarios del empleado
    for (let i = 0; i < lista.length; i++) {
      if (horaInicio <= parseInt(lista[i].HoraInicio.replace(":", ""))) {
        //si horaFin<= parseInt(lista[i].HoraInicio.replace(":", "")) puedo insertar, entonces el que tengo que preguntar es si horaFin > parseInt(lista[i].i.replace(":", ""))
        if (horaFin > parseInt(lista[i].HoraInicio.replace(":", ""))) {
          puedoInsertar = false;
        }
      } else {
        // caso del else: horaInicio > parseInt(lista[i].i.replace(":", ""))
        if (horaInicio < parseInt(lista[i].HoraFin.replace(":", ""))) {
          puedoInsertar = false;
        }
      }
    }
    return puedoInsertar;
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para verificar que un horario siga disponible
//Este metodo es utilizado para cuando se modifica una agenda, porque tiene un comportamiento en particular
//En lugar de ir a buscar todos los horarios del empleado, aca lo que hace es buscar todos sacando un horario en particular del listado que es el horario actual de la agenda
//Devuelve una promesa con true o false
const verificarHorarioModificarAgenda = async (horario) => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Voy a buscar todos los horarios del empleado que me mandaron
    const horarios = await pool
      .request()
      .input("ci", sql.VarChar, horario.ciEmpleado)
      .input("fecha", sql.Date, horario.fecha)
      .input("idHorario", sql.Int, horario.idHorario)
      .query(
        "select HoraInicio, HoraFin from Horario H, Agenda A where Cedula = @ci and Fecha = @fecha and A.IdHorario = H.IdHorario and A.Aceptada = 1 and H.IdHorario <> @idHorario"
      );
    //Separo el listado
    const lista = horarios.recordset;
    //Paso a valores numericos los datos del horario que me pasan por parametro para poder trabajar mejor
    let horaInicio = parseInt(horario.i.replace(":", ""));
    let horaFin = parseInt(horario.f.replace(":", ""));
    //Esta variable es la que devuelvo al final, arranca en true y en el for se evalua para pasar a false
    let puedoInsertar = true;
    //Recorro los horarios del empleado
    for (let i = 0; i < lista.length; i++) {
      if (horaInicio <= parseInt(lista[i].HoraInicio.replace(":", ""))) {
        //si horaFin<= parseInt(lista[i].HoraInicio.replace(":", "")) puedo insertar, entonces el que tengo que preguntar es si horaFin > parseInt(lista[i].i.replace(":", ""))
        if (horaFin > parseInt(lista[i].HoraInicio.replace(":", ""))) {
          puedoInsertar = false;
        }
      } else {
        // caso del else: horaInicio > parseInt(lista[i].i.replace(":", ""))
        if (horaInicio < parseInt(lista[i].HoraFin.replace(":", ""))) {
          puedoInsertar = false;
        }
      }
    }
    return puedoInsertar;
  } catch (error) {
    console.log(error);
  }
};

//Este es un metodo que dado los datos de un horario lo inserta en la base de datos
//Es un metodo auxiliar que devuelve el id del horario en caso de que se inserte, si no devuelve -1
const insertarHorario = async (horario) => {
  const pool = await sql.connect(conexion);
  const resultado = await verificarHorario(horario)
    .then((puedoInsertar) => {
      if (puedoInsertar) {
        const insertHorario = pool
          .request()
          .input("Cedula", sql.VarChar, horario.ciEmpleado)
          .input("HoraInicio", sql.VarChar, horario.i)
          .input("HoraFin", sql.VarChar, horario.f)
          .input("Fecha", sql.Date, horario.fecha)
          .query(
            "insert into Horario (Cedula, HoraInicio, HoraFin, Fecha) OUTPUT inserted.IdHorario values (@Cedula, @HoraInicio, @HoraFin, @Fecha)"
          );
        return insertHorario;
      } else {
        return -1;
      }
    })
    .then((resultado) => {
      //Verifico si exploto o no
      if (resultado === -1) {
        return { idAgenda: -1 };
      }
      //El objeto que me devuele el insert tiene la cantidad de filas afectadas y el idHorario del horario que acabo de insertar
      //Devuelvo el idHorario
      return resultado.recordset[0].IdHorario;
    });
  //Cuando tengo el resultado ya en la variable devuelvo el id del horario que recien se inserto
  return resultado;
};
//Este es un metodo que dado los datos de una agenda lo inserta en la base de datos
//Es un metodo auxiliar que devuelve el idAgenda y idHorario si se inserta, si no devuelve en cada uno -1
const insertarAgenda = async (agenda) => {
  //Variable que tiene la conexion
  const pool = await sql.connect(conexion);
  //Armo el insert
  const insertAgenda = await pool
    .request()
    .input("NombreCliente", sql.VarChar, agenda.nombre)
    .input("Descripcion", sql.VarChar, agenda.descripcion)
    .input("Img", sql.VarChar, agenda.imagenEjemplo)
    .input("Tel", sql.VarChar, agenda.telefono)
    .input("Aceptada", sql.Bit, agenda.aceptada)
    .input("IdHorario", sql.Int, agenda.idHorario)
    .query(
      "insert into Agenda (NombreCliente, Descripcion, Img, Tel, Aceptada, IdHorario) OUTPUT inserted.IdHorario, inserted.IdAgenda values (@NombreCliente, @Descripcion, @Img, @Tel, @Aceptada, @IdHorario)"
    )
    .then((resultado) => {
      if (agenda.ciCliente !== -1) {
        return insertarAgendaCliente({
          ciCliente: agenda.ciCliente,
          idHorario: resultado.recordset[0].IdHorario,
          idAgenda: resultado.recordset[0].IdAgenda,
        }).then((resCli) => {
          let retorno = {
            idHorario: resCli.IdHorario,
            idAgenda: resCli.IdAgenda,
          };
          return retorno;
        });
      } else {
        let ret = {
          idHorario: resultado.recordset[0].IdHorario,
          idAgenda: resultado.recordset[0].IdAgenda,
        };
        return ret;
      }
      //El objeto resultado devuelve la cantidad de filas afectadas, el idAgenda y el idHorario
    })
    .catch((error) => {
      console.log(error);
      //Armo un objeto con el error y los valores en -1
      return {
        error: error,
        idHorario: -1,
        idAgenda: -1,
      };
    });
  //Cuando tengo el resultado del insert de la agenda, devuelvo el idAgenda y el idHorario
  return insertAgenda;
};

//Este es un metodo que dado los datos de una agenda y un servicio lo inserta en la base de datos
//Es un metodo auxiliar que devuelve la cantida de filas afectadas
//Este metodo espera un objeto de este estilo
/*
  {
   servicios:[1, 3, 4],
   idAgenda: 1,
   idHorario: 1,
  }
*/
const insertarServicioAgenda = async (servicioAgenda) => {
  //Variable que tiene la conexion
  const pool = await sql.connect(conexion);
  //Creo la tabla que voy a insertar
  const tabla = new sql.Table("PeluqueriaLander.dbo.Agenda_Servicio");
  tabla.database = "PeluqueriaLander";
  //Tengo que decir si creo la tabla o no
  tabla.create = false;
  //Segun lo leido tengo que insertar a la variable 'tabla' las columnas que va a tener
  tabla.columns.add("IdAgenda", sql.Int, { nullable: false, primary: true });
  tabla.columns.add("IdHorario", sql.Int, { nullable: true });
  tabla.columns.add("IdServicio", sql.Int, { nullable: false, primary: true });
  //Por cada servicio que me llegue agrego una fila (row)
  servicioAgenda.servicios.forEach((servicio) => {
    tabla.rows.add(servicioAgenda.idAgenda, servicioAgenda.idHorario, servicio);
  });
  //Creo el request que voy a hacer
  const request = pool.request();
  //Le digo al request que haga el insert
  const resultado = await request.bulk(tabla);
  //Devuelvo el resultado que es la cantidad de filas afectadas
  return resultado.rowsAffected;
};

//Metodo auxiliar para agregar una agenda a un cliente
//Me llega un objeto de este estilo
/*
  {
   cedula: '1234567',
   idAgenda: 1,
   idHorario: 1,
  }
*/
const insertarAgendaCliente = async (datosAgendaCliente) => {
  try {
    //Variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Armo el insert
    const insertAgendaCliente = await pool
      .request()
      .input("ciCliente", sql.VarChar, datosAgendaCliente.ciCliente)
      .input("idHorario", sql.Int, datosAgendaCliente.idHorario)
      .input("idAgenda", sql.Int, datosAgendaCliente.idAgenda)
      .query(
        "insert into Agenda_Cliente (IdAgenda, IdHorario, Cedula) OUTPUT inserted.IdHorario, inserted.IdAgenda values (@idAgenda, @idHorario, @ciCliente)"
      );
    return insertAgendaCliente.recordset[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo que se va a usar para ver si insertamos la agenda con 0 o con 1 en aceptada
const verificarManejoAgenda = async (agenda) => {
  try {
    return getManejoAgendas().then((manejoAgenda) => {
      if (manejoAgenda.AceptarRechazar === 1) {
        return verificarHorario({
          ciEmpleado: agenda.ciEmpleado,
          i: agenda.horario.i,
          f: agenda.horario.f,
          fecha: agenda.fecha,
        }).then((horarioDisponible) => {
          if (horarioDisponible) {
            let nuevaAgenda = {
              ...agenda,
              aceptada: manejoAgenda.AceptarRechazar,
            };
            return crearSolicitudAgenda(nuevaAgenda).then(
              (resultado) => resultado
            );
          } else {
            return mensajeCrearAgenda({
              codigo: 400,
              mensaje: "El horario ya fue ocupado",
            }).then((respuestaFinal) => respuestaFinal);
          }
        });
      } else if (manejoAgenda.AceptarRechazar === 0) {
        let nuevaAgenda = { ...agenda, aceptada: manejoAgenda.AceptarRechazar };
        return crearSolicitudAgenda(nuevaAgenda).then((resultado) => resultado);
      } else {
        return mensajeCrearAgenda({
          codigo: 400,
          mensaje:
            "No se estan aceptado mas agendas. Por favor comunicarse con el local",
        }).then((resultado) => resultado);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//Metodo para agregar la agenda a la base, voy a recibir los datos todos dentro del objeto agenda
const crearSolicitudAgenda = async (agenda) => {
  //Esto lo que hace es insertar primero el horario, despues la agenda y al final agenda servicio
  return insertarHorario({
    ciEmpleado: agenda.ciEmpleado,
    i: agenda.horario.i,
    f: agenda.horario.f,
    fecha: agenda.fecha,
  })
    .then((resHorario) => {
      //El resultado de la promesa de insertarHorario es el id del horario que se acaba de insertar
      //Controlo de que si el id es -1 es porque dio error
      if (resHorario.idAgenda < 0) {
        throw { codigo: 400, mensaje: "Error al insertar agenda" };
      }
      //Esto lo que hace es devolver la promesa que devuelve el insertar agenda
      //Esto le llega al then de arriba para que pueda hacerle .then abajo y seguir trabajando
      return insertarAgenda({
        ciCliente: agenda.ciCliente,
        nombre: agenda.nombreCliente,
        descripcion: agenda.descripcion,
        imagenEjemplo: agenda.imagenEjemplo,
        telefono: agenda.telefono,
        aceptada: agenda.aceptada, //Esto hay que ver porque capaz se puede modificar para que siempre me lo manden y no lo tenga que hardcodear
        idHorario: resHorario,
      });
    })
    .then((resAgenda) => {
      if (resAgenda.idHorario === -1) {
        return { codigo: 400, mensaje: "Error al insertar agenda" };
      } else {
        return insertarServicioAgenda({
          idAgenda: resAgenda.idAgenda,
          idHorario: resAgenda.idHorario,
          servicios: agenda.servicios,
        })
          .then((resServicioAgenda) => {
            //El resultado de la promesa de insertarServicioAgenda es la cantidad de filas afectadas, es decir la cantidad de registros que se guardaron en la tabla
            if (resServicioAgenda === agenda.servicios.length) {
              return { codigo: 200, mensaje: "Agenda insertada correctamente" };
            } else {
              return { codigo: 400, mensaje: "Error al insertar agenda" };
            }
          })
          .then((respuestaEntera) => {
            return mensajeCrearAgenda(respuestaEntera);
          })
          .then((resultado) => resultado)
          .catch((error) => {
            return error;
          });
      }
    });
};

//Metodo auxiliar para devolver un mensaje al crear la agenda y mandar los datos de nuevo
const mensajeCrearAgenda = async (mensajeCrear) => {
  try {
    return getDatosFormulario().then((datosFormulario) => {
      return { ...mensajeCrear, datos: datosFormulario };
    });
  } catch (error) {
    console.log();
  }
};

//Metodo auxiliar para conseguir todas las agendas aceptadas
//Devuelve una promesa
const getListadoAgendasAceptadas = async () => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Voy a buscar todas las agendas
    const agendas = await pool
      .request()
      .query(
        "select A.IdAgenda as id, A.NombreCliente as title, H.Fecha as fecha, H.Cedula as empleado, A.IdHorario as idHorario from Agenda A, Horario H where A.Aceptada = 1 and H.IdHorario = A.IdHorario"
      );
    //Separo los datos de la consulta
    const listadoAgendas = agendas.recordset;
    return listadoAgendas;
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para agregar todos los servicios a las agendas aceptadas
//Devuelve una promesa
const agregarServiciosAgendasAceptadas = async (agendas) => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Voy a buscar todos los servicios
    const servicios = await pool
      .request()
      .query(
        "select A.IdAgenda, S.IdServicio from Agenda A, Agenda_Servicio S where A.IdAgenda = S.IdAgenda and A.Aceptada = 1 order by IdAgenda"
      );
    //Separo los datos de la consulta
    const listadoServicios = servicios.recordset;
    //Armo el array de retorno
    let arrayRetorno = [];
    //Recorro el listado de agendas para irle agregando
    for (let i = 0; i < agendas.length; i++) {
      //Armo un objeto con los datos de la agenda y le agrego un array de servicios
      let agendaAux = {
        ...agendas[i],
        servicios: [],
      };
      //Recorro el listado de servicios para agregarlo a la agendaAux
      for (let j = 0; j < listadoServicios.length; j++) {
        if (agendaAux.id === listadoServicios[j].IdAgenda) {
          agendaAux.servicios.push(listadoServicios[j].IdServicio);
        }
      }
      arrayRetorno.push(agendaAux);
    }
    return arrayRetorno;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para devolver todas las agendas aceptadas
const getAgendasAceptadas = async () => {
  try {
    //Llamo a los metodos auxiliares
    const retorno = getListadoAgendasAceptadas()
      .then((listado) => {
        return agregarServiciosAgendasAceptadas(listado);
      })
      .then((listadoCompleto) => {
        return listadoCompleto;
      });
    return retorno;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para devolver todos los productos
const getListadoProductos = async () => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Voy a buscar todos los productos
    const productos = await pool
      .request()
      .query(
        "select IdProducto as id, Nombre as nombre, Stock as stock, Precio as price, Discontinuado as discontinuado from Producto"
      );
    //Separo el listado
    const listadoProductos = productos.recordset;
    return listadoProductos;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para devolver el ci y nombre del empleado
const getCiNombreEmpleados = async () => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Voy a buscar todos los empleados
    const empleados = await pool
      .request()
      .query(
        "select Cedula as id, Nombre as title from Empleado where Habilitado = 1"
      );
    //Separo el listado
    const listadoEmpleados = empleados.recordset;
    return listadoEmpleados;
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para agregar los empleados a un listado
const agregarEmpleadosALIstado = async (listado) => {
  try {
    return getCiNombreEmpleados().then((listadoEmpleados) => {
      return agregarDuracionEmpleados(listadoEmpleados).then(
        (listadoConDuraciones) => {
          let retornoAux = {
            ...listado,
            empleados: listadoConDuraciones,
          };
          return retornoAux;
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para agregar los productos a un listado
const agregarProductosAListado = async (listado) => {
  try {
    const resultado = getListadoProductos().then((listadoProductos) => {
      let retornoAux = {
        agendas: listado,
        productos: listadoProductos,
      };
      return retornoAux;
    });
    return resultado;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para agregar los servicios al array que devuelvo
//Devuelvo una promesa
const agregarServiciosParaCaja = async (listado) => {
  let retorno = getServicios().then((resultado) => {
    //Armo el array entero con todo
    let objetoRetorno = {
      ...listado,
      servicios: resultado,
    };
    return objetoRetorno;
  });
  return retorno;
};

//Metodo auxiliar para agregar si la caja esta abierta o no
const agregarIdCaja = async (listado) => {
  let retorno = getCaja().then((caja) => {
    if (caja.rowsAffected[0] < 1) {
      //Armo el array entero con todo
      return {
        ...listado,
        caja: { idCaja: -1 },
      };
    } else {
      //Si hay caja entonces me tengo que fijar el monto
      if (caja.recordset[0].total !== 0) {
        return {
          ...listado,
          caja: { idCaja: -1 },
        };
      } else {
        //Armo el array entero con todo
        return {
          ...listado,
          caja: caja.recordset[0],
        };
      }
    }
  });
  return retorno;
};

//Metodo para devolver una caja al frontend
const cajaParaCalculos = async () => {
  return getCaja().then((caja) => {
    if (caja.rowsAffected[0] < 1) {
      //Armo el array entero con todo
      return {
        caja: { idCaja: -1 },
      };
    } else {
      //Si hay caja entonces me tengo que fijar el monto
      if (caja.recordset[0].total > 0) {
        return {
          caja: { idCaja: -1 },
        };
      } else {
        //Armo el array entero con todo
        return {
          caja: caja.recordset[0],
        };
      }
    }
  });
};

//Metodo para devolver todos los datos del formulario de caja
const datosFormularioCaja = async () => {
  try {
    const resultado = getAgendasAceptadas()
      .then((agendas) => {
        return agregarProductosAListado(agendas);
      })
      .then((listadoConProductos) => {
        return agregarEmpleadosALIstado(listadoConProductos);
      })
      .then((listadoCompletoSinServicios) => {
        return agregarServiciosParaCaja(listadoCompletoSinServicios);
      })
      .then((listadoCompleto) => {
        return agregarIdCaja(listadoCompleto);
      })
      .then((listadoCompletoConCaja) => {
        return listadoCompletoConCaja;
      });
    return resultado;
  } catch (error) {
    console.log(error);
  }
};

//Modificar una agenda
//Modificar una agenda deberia ser. Modifico todos los datos del Horario, despues modifico todo de la Agenda y despues Modifico todo de los servicios
const modificarAgenda = async (nuevaAgenda) => {
  try {
    const resultado = verificarHorarioModificarAgenda(nuevaAgenda.horario)
      .then((horarioLibre) => {
        if (!horarioLibre) {
          return { codigo: 400, mensaje: "El horario ya esta ocupado" };
        } else {
          return updatesAgendaEntero(nuevaAgenda);
        }
      })
      .then((mensajeRespuesta) => {
        return mensajeRespuesta;
      });
    return resultado;
  } catch (error) {
    return error;
  }
};

//Metodo auxiliar para hacer los update para modificar una agenda
const updatesAgendaEntero = async (nuevaAgenda) => {
  //Llamo a todos los metodos de update individuales
  return updateHorario(nuevaAgenda.horario)
    .then((filasAfectadasHorario) => {
      if (filasAfectadasHorario < 1) {
        return { codigo: 400, mensaje: "Error al actualizar el Horario" };
      } else {
        return updateAgenda(nuevaAgenda);
      }
    })
    .then((filasAfectadasAgenda) => {
      if (filasAfectadasAgenda < 1) {
        return { codigo: 400, mensaje: "Error al actualizar Agenda" };
      } else {
        let servicios = {
          idAgenda: nuevaAgenda.idAgenda,
          servicios: nuevaAgenda.servicios,
          idHorario: nuevaAgenda.idHorario,
        };
        return modificarServicioAgenda(servicios);
      }
    })
    .then((serviciosModificados) => {
      if (isNaN(serviciosModificados)) {
        return serviciosModificados;
      } else {
        return { codigo: 200, mensaje: "Agenda modificada correctamente" };
      }
    });
};

//Metodo auxiliar para hacer update a la tabla Horario
//Esto tiene que recibir un objeto de esta manera
// {
//   i: "20:00",
//   f: "20:30",
//   ciEmpleado: "12345678",
//   fecha: "2021-07-23"
// }
const updateHorario = async (horario) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el update del horario
    let updateHorario = await pool
      .request()
      .input("idHorario", sql.Int, horario.idHorario)
      .input("horaInicio", sql.VarChar, horario.i)
      .input("horaFin", sql.VarChar, horario.f)
      .input("fecha", sql.Date, horario.fecha)
      .input("ci", sql.VarChar, horario.ciEmpleado)
      .query(
        "update Horario set Cedula = @ci, HoraInicio = @horaInicio, HoraFin = @horaFin, Fecha = @fecha where IdHorario = @idHorario"
      );
    return updateHorario.rowsAffected;
    //Si la agenda esta aceptada devuelvo eso
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para hacerle update a la tabla Agenda
const updateAgenda = async (agenda) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el update del Agenda
    let updateAgenda = await pool
      .request()
      .input("idAgenda", sql.Int, agenda.idAgenda)
      .input("nombreCliente", sql.VarChar, agenda.nombreCliente)
      .input("desc", sql.VarChar, agenda.descripcion)
      .input("img", sql.VarChar, agenda.imagenEjemplo)
      .input("tel", sql.Date, agenda.tel)
      .query(
        "update Agenda set NombreCliente = @nombreCliente, Descripcion = @desc, Img = @img, Tel = @tel where IdAgenda = @idAgenda"
      );
    return updateAgenda.rowsAffected;
    //Si la agenda esta aceptada devuelvo eso
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para modificar los servicios de una agenda
//Espero que me llegue un objeto de la siguiente manera
// {
//   idAgenda: 1,
//   servicios: [1, 4, 6],
//   idHorario: 1
// }
const modificarServicioAgenda = async (nuevosServicios) => {
  try {
    //Llamo al metodo que elimina todos las filas de la tabla Servicio Agenda para un idAgenda dado
    const resultado = eliminarServicioAgendaPorIdAgenda(
      nuevosServicios.idAgenda
    )
      .then((serviciosEliminados) => {
        //Verifico cuantas filas fueron afectadas por  el delete
        //Si no se afecto ninguna fila (0 afectadas) devuelvo error
        if (serviciosEliminados <= 0) {
          return {
            codigo: 400,
            mensaje: "No se pudieron eliminar los servicios",
          };
        } else {
          //Si hubo filas afectadas entonces se eliminaron todos los servicios de esa agenda y ahora hay que insertar los nuevos
          return insertarServicioAgenda(nuevosServicios);
        }
      })
      .then((serviciosInsertados) => {
        //Verifico que se hayan insertado los nuevos servicios
        //Si la cantidad de filas afectadas no es la misma que la cantidad de servicios que me mandan, devuelvo error
        if (serviciosInsertados !== nuevosServicios.servicios.length) {
          return {
            codigo: 400,
            mensaje: "No se pudieron insertar los nuevos servicios",
          };
        } else {
          return serviciosInsertados;
        }
      });
    return resultado;
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para eliminar todos los servicios de una agenda dada
const eliminarServicioAgendaPorIdAgenda = async (idAgenda) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el delete de los servicios
    const deleteAgendaServicio = await pool
      .request()
      .input("idAgenda", sql.Int, idAgenda)
      .query("delete from Agenda_Servicio where IdAgenda = @idAgenda");
    //Separo la cantidad de filas afectadas
    const filasAfectadas = deleteAgendaServicio.rowsAffected[0];
    //Devuelvo la cantidad de filas afectadas
    return filasAfectadas;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para crear un usuario nuevo
const registrarCliente = async (nuevoCliente) => {
  try {
    //Llamo al metodo que verifica de si el cliente existe o no
    const resultado = existeCliente(nuevoCliente.ciUsuario)
      .then((existe) => {
        if (existe) {
          return { codigo: 400, mensaje: "El cliente ya existe" };
        } else {
          return insertarCliente(nuevoCliente);
        }
      })
      .then((resultadoFinal) => resultadoFinal);
    return resultado;
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para insertar un cliente en la tabla cliente
const insertarCliente = async (nuevoCliente) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Junto el nombre y el apellido
    let nombreApellido = nuevoCliente.nombre + " " + nuevoCliente.apellido;
    //Hago el insert en la tabla cliente
    const insertCliente = await pool
      .request()
      .input("ciUsuario", sql.VarChar, nuevoCliente.ciUsuario)
      .input("nombre", sql.VarChar, nombreApellido)
      .input("telefono", sql.VarChar, nuevoCliente.telefono)
      .input("contra", sql.VarChar, nuevoCliente.contra)
      .query(
        "insert into Cliente (Cedula, Nombre, Contra, Tel) values (@ciUsuario, @nombre, @contra, @telefono)"
      );
    if (insertCliente.rowsAffected[0] === 1) {
      return { codigo: 200 };
    } else {
      return { codigo: 400, mensaje: "Error al registrar cliente" };
    }
  } catch (error) {
    console.log(error);
  }
};
//Metodo auxiliar para verificar de si existe un cliente o no
const existeCliente = async (ciCliente) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Busco si existe el cliente
    const cliente = await pool
      .request()
      .input("ciUsuario", sql.VarChar, ciCliente)
      .query("select Cedula from Cliente where Cedula = @ciUsuario");
    if (cliente.recordset[0].Cedula === ciCliente) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para el login
const login = async (usuario) => {
  try {
    return getEmpleadoParaLogin(usuario).then((resultado) => {
      if (resultado.rowsAffected[0] === 1) {
        return debeCambiarContra(resultado.recordset[0].ciUsuario).then(
          (debeCambiar) => {
            if (debeCambiar) {
              return {
                codigo: 402,
                mensaje: "El usuario debe cambiar la contraseña",
                usuario: resultado.recordset[0],
              };
            } else {
              return { codigo: 200, usuario: resultado.recordset[0] };
            }
          }
        );
      } else {
        return getClienteParaLogin(usuario).then((cliente) => {
          if (cliente.rowsAffected[0] === 1) {
            return debeCambiarContra(cliente.recordset[0].ciUsuario).then(
              (debeCambiar) => {
                if (debeCambiar) {
                  return {
                    codigo: 402,
                    mensaje: "El usuario debe cambiar la contraseña",
                    usuario: { ...cliente.recordset[0], rol: "Cliente" },
                  };
                } else {
                  return {
                    codigo: 200,
                    usuario: { ...cliente.recordset[0], rol: "Cliente" },
                  };
                }
              }
            );
          } else {
            return { codigo: 400, error: "Credenciales incorrectas" };
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para ir a buscar un empleado por su cedula y contra
const getEmpleadoParaLogin = async (datosEmpleado) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select de la tabla empleado
    const empleado = await pool
      .request()
      .input("ciUsuario", sql.VarChar, datosEmpleado.ciUsuario)
      .input("contra", sql.VarChar, datosEmpleado.contra)
      .query(
        "select E.Cedula as ciUsuario, E.Nombre as nombre, R.Nombre as rol from Empleado E, Rol R, Empleado_Rol RE where RE.IdRol = R.IdRol and E.Cedula = RE.Cedula and E.Cedula = @ciUsuario and E.Contra = @contra and E.Habilitado = 1"
      );
    return empleado;
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para ir a buscar un cliente por su cedula y contra
const getClienteParaLogin = async (datosCliente) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select de la tabla cliente
    const cliente = await pool
      .request()
      .input("ciUsuario", sql.VarChar, datosCliente.ciUsuario)
      .input("contra", sql.VarChar, datosCliente.contra)
      .query(
        "select C.Cedula as ciUsuario, C.Nombre as nombre, C.Tel as telefono from Cliente C where C.Cedula = @ciUsuario and C.Contra = @contra"
      );
    return cliente;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para abrir una caja
const abrirCaja = async (entrada) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Abro la caja, es decir que inserto una linea en la tabla caja con la fecha de hoy
    const insertCaja = await pool
      .request()
      .query(
        "insert into Caja(Fecha, Total) output inserted.IdCaja as idCaja, inserted.Fecha as fecha, inserted.Total as total values (CAST(GETDATE() AS DATE), 0)"
      );
    //Agarro el id de la caja que acabo de insertar
    const idCaja = insertCaja.recordset[0].idCaja;
    //Despues de insertar tengo que hacer una entrada de caja a la caja actual con el monto inicial
    const insertMontoInicial = nuevaEntradaDinero(
      idCaja,
      entrada.pago.Efectivo,
      entrada.pago,
      entrada.cedula,
      entrada.productosVendidos,
      entrada.servicios,
      "A" //Esto corresponde a la descripcion de la entrada de dinero
    ).then((resultado) => resultado);
    return insertCaja.recordset[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para hacer una entrada de dinero
/*
el objeto pago es del estilo. Llega en 0 si no se uso nada
{
  numeroTicket: 
  Efectivo:montoE,
  Debito:montoD,
  Cuponera:montoC,
}
*/
const nuevaEntradaDinero = async (
  idCaja,
  monto,
  pago,
  cedula,
  listadoProductos,
  listadoServicios,
  descripcion
) => {
  try {
    //Hago primero el insert en la tabla entrada
    const insertoEntradaDinero = insertarEntradaDinero(
      monto,
      cedula,
      descripcion,
      pago.propina
    )
      .then((idEntrada) => {
        //Armo un listado para guardar todas las promesas que haya hecho
        const listadoPromesas = [];
        //Ahora tengo que ver en que otras tablas deberia insertar
        //Primero verifico cual fue el medio de pago que usaron
        //En la variable agregoPago guardo la promesa del medio de pago que haya insertado
        if (pago.Efectivo > 0) {
          const agregoPago = insertarEntradaEfectivo(
            idEntrada,
            1,
            pago.Efectivo
          );
          listadoPromesas.push(agregoPago);
        }
        if (pago.Cuponera > 0) {
          //Llamar al metodo que descuenta el saldo de la cuponera
          const agregoPago = insertarEntradaEfectivo(
            idEntrada,
            3,
            pago.Cuponera
          );
          listadoPromesas.push(agregoPago);
        }
        if (pago.Debito > 0) {
          const agregoPago = insertarEntradaDebito(
            idEntrada,
            2,
            pago.Debito,
            pago.numeroTicket
          );
          listadoPromesas.push(agregoPago);
        }
        //Ahora tengo que verificar si se vendieron productos
        if (listadoProductos !== null) {
          const agregoProductos = cobrarEntradaProducto(
            idEntrada,
            listadoProductos
          );
          listadoPromesas.push(agregoProductos);
        }
        //Ahora verifico si se hizo algun servicio
        if (listadoServicios !== null) {
          const agregoServicios = insertarEntradaServicio(
            idEntrada,
            listadoServicios
          );
          listadoPromesas.push(agregoServicios);
        }
        //Agrego la entrada a la caja
        const agregarEntradaCaja = insertarCajaEntrada(idCaja, idEntrada);
        listadoPromesas.push(agregarEntradaCaja);
        //Resuelvo todas las promesas
        return Promise.allSettled(listadoPromesas).then((respuestas) => {
          //Aca tengo que verificar que me devolvieron las promesas para tener una idea
          let salioBien = true;
          //Recirro todas las promesas y veo el estado de ellas
          respuestas.forEach((promesa) => {
            if (promesa.status !== "fulfilled") {
              console.log(promesa);
              salioBien = false;
            }
          });
          if (salioBien) {
            return {
              codigo: 200,
              mensaje: "Entrada de dinero insertada correctamente",
            };
          } else {
            return {
              codigo: 400,
              mensaje: "Le erramos a algo insertando la entrada",
            };
          }
        });
      })
      .then((resultado) => {
        return resultado;
      });
    return insertoEntradaDinero;
  } catch (error) {
    console.log(error);
  }
};

//Metodo que se va a llamar cuando se haga una entrada de dinero
//Esto lo que va a hacer es hacer la entrada de dinero y despues va a eliminar la agenda en caso de que corresponda
const realizarEntradaDinero = async (
  idCaja,
  monto,
  pago,
  cedula,
  listadoProductos,
  listadoServicios,
  descripcion,
  idAgenda,
  idHorario
) => {
  //Aca lo primero que tengo que hacer es hacer la entrada de dinero
  return nuevaEntradaDinero(
    idCaja,
    monto,
    pago,
    cedula,
    listadoProductos,
    listadoServicios,
    descripcion
  ).then((resultadoEntrada) => {
    //Primero tengo que verificar si la entrada se hizo o no
    if (resultadoEntrada.codigo !== 200) {
      //Si dio algun codigo que no sea el de exito entonces devuelvo ese mensaje
      return resultadoEntrada;
    } else {
      //Aca verifico de si hay agenda o no
      //Si hay agenda la borro, si no, solamente aviso de que se cobro todo
      if (idAgenda !== -1 && idHorario !== -1) {
        return cancelarAgenda(idAgenda, idHorario).then((resultado) => {
          if (resultado.codigo === 200) {
            return {
              codigo: 200,
              mensaje: "Entrada realizada correctamente, la agenda fue borrada",
            };
          } else {
            //Si quedo en error entonces devuelvo el error
            return resultado;
          }
        });
      } else {
        return resultadoEntrada;
      }
    }
  });
};

//Metodo auxiliar para hacer el insert en la tabla EntradaDinero
const insertarEntradaDinero = async (monto, cedula, descripcion, propina) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Si el monto es null lo paso a 0
    let montoAinsertar = monto === null ? 0 : monto;
    //Hago el insert en la tabla EntradaDinero
    const insertEntradaDinero = await pool
      .request()
      .input("monto", sql.Int, montoAinsertar)
      .input("cedula", sql.VarChar, cedula)
      .input("descripcion", sql.Char, descripcion)
      .input("propina", sql.Int, propina)
      .query(
        "insert into EntradaDinero(Cedula, Monto, Fecha, Descripcion, Propina) output inserted.IdEntrada values(@cedula, @monto, GETDATE(), @descripcion, @propina)"
      );
    return insertEntradaDinero.recordset[0].IdEntrada;
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para hacer el insert en la tabla EntradaEfectivo
//Este metodo se usa para cuando pagan con efectivo o cuponera, el idMedioPago puede ser el de Efectivo o Cuponera
const insertarEntradaEfectivo = async (idEntrada, idMedioPago, monto) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el insert en la tabla EntradaEfectivo
    const insertEntradaEfectivo = await pool
      .request()
      .input("idEntrada", sql.Int, idEntrada)
      .input("idMedioPago", sql.Int, idMedioPago)
      .input("monto", sql.Int, monto)
      .query(
        "insert into Entrada_Efectivo(IdEntrada, IdMedioPago, Monto) values(@idEntrada, @idMedioPago, @monto)"
      );
    return {
      filasAfectadas: insertEntradaEfectivo.rowsAffected[0],
      tablaInsertada: "Entrada_Efectivo",
    };
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para hacer el insert en la tabla EntradaDebito
const insertarEntradaDebito = async (idEntrada, idMedioPago, monto, ticket) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el insert en la tabla EntradaEfectivo
    const insertEntradaDebito = await pool
      .request()
      .input("idEntrada", sql.Int, idEntrada)
      .input("idMedioPago", sql.Int, idMedioPago)
      .input("monto", sql.Int, monto)
      .input("ticket", sql.Int, ticket)
      .query(
        "insert into Entrada_Debito(IdEntrada, IdMedioPago, Monto, NroTicket) output inserted.IdEntrada values(@idEntrada, @idMedioPago, @monto, @ticket)"
      );
    return {
      filasAfectadas: insertEntradaDebito.rowsAffected[0],
      tablaInsertada: "Entrada_Debito",
    };
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para hacer el insert en la tabla EntradaProducto
//El listado de productos tiene objetos del estilo {id: , cantidad: }
const insertarEntradaProducto = async (idEntrada, listadoProductos, monto) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Creo la tabla que voy a insertar
    const tabla = new sql.Table("PeluqueriaLander.dbo.Entrada_Producto");
    //Le digo cual es la base de datos que corresponde la tabla
    tabla.database = "PeluqueriaLander";
    //Tengo que decir si creo la tabla o no
    tabla.create = false;
    //Segun lo leido tengo que insertar a la variable 'tabla' las columnas que va a tener
    tabla.columns.add("IdEntrada", sql.Int, { nullable: false, primary: true });
    tabla.columns.add("IdProducto", sql.Int, {
      nullable: false,
      primary: true,
    });
    tabla.columns.add("Cantidad", sql.Int, { nullable: true });
    //Por cada producto que me llegue agrego una fila (row)
    listadoProductos.forEach((producto) => {
      tabla.rows.add(idEntrada, producto.idProducto, producto.cantidad);
    });
    //Creo el request que voy a hacer
    const request = pool.request();
    //Le digo al request que haga el insert
    const resultado = await request.bulk(tabla);
    //Devuelvo el resultado que es la cantidad de filas afectadas
    return {
      filasAfectadas: resultado.rowsAffected[0],
      tablaInsertada: "Entrada_Producto",
    };
  } catch (error) {
    console.log(error);
  }
};

//Metodo para cobrar los productos
//Hago el insert en la tabla de producto y hago el descuento del stock
const cobrarEntradaProducto = async (idEntrada, listadoProductos) => {
  try {
    //Primero cobro los articulos, despues inserto en la tabla de EntradaProducto
    return modificarStockListadoProducto(listadoProductos)
      .then((resultado) => {
        //Aca hago el insert en la tabla Entrada_Producto
        return insertarEntradaProducto(idEntrada, listadoProductos);
      })
      .then((res) => res);
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para hacer el insert en la tabla EntradaServicio
//Me llega un listado con los id de los servicios que se hace
const insertarEntradaServicio = async (idEntrada, listadoServicios) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Creo la tabla que voy a insertar
    const tabla = new sql.Table("PeluqueriaLander.dbo.Entrada_Servicio");
    //Le digo cual es la base de datos que corresponde la tabla
    tabla.database = "PeluqueriaLander";
    //Tengo que decir si creo la tabla o no
    tabla.create = false;
    //Segun lo leido tengo que insertar a la variable 'tabla' las columnas que va a tener
    tabla.columns.add("IdEntrada", sql.Int, { nullable: false, primary: true });
    tabla.columns.add("IdServicio", sql.Int, {
      nullable: false,
      primary: true,
    });
    //Por cada idServicio que me llegue agrego una fila (row)
    listadoServicios.forEach((idServicio) => {
      tabla.rows.add(idEntrada, idServicio.id);
    });
    //Creo el request que voy a hacer
    const request = pool.request();
    //Le digo al request que haga el insert
    const resultado = await request.bulk(tabla);
    //Devuelvo el resultado que es la cantidad de filas afectadas
    return {
      filasAfectadas: resultado.rowsAffected[0],
      tablaInsertada: "Entrada_Servicio",
    };
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para hacer el insert de la entrada en la caja. Tabla Caja_Entrada
const insertarCajaEntrada = async (idCaja, idEntrada) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el insert en la tabla EntradaEfectivo
    const insertCajaEntrada = await pool
      .request()
      .input("idEntrada", sql.Int, idEntrada)
      .input("idCaja", sql.Int, idCaja)
      .query(
        "insert into Caja_Entrada(IdCaja, IdEntrada) values(@idCaja, @idEntrada)"
      );
    return {
      filasAfectadas: insertCajaEntrada.rowsAffected[0],
      tablaInsertada: "Caja_Entrada",
    };
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para conseguir la caja de un dia dado
const getCaja = async () => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select para que me traiga la caja
    const caja = await pool
      .request()
      .query(
        "select top 1 IdCaja as idCaja, Fecha as fecha, Total as total from Caja C where Total <> -1 order by Fecha desc, total"
      );
    return caja;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para ir a buscar la caja mediante su id
const getCajaPorId = async (idCaja) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select para que me traiga la caja
    const caja = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .query("select * from Caja where IdCaja = @idCaja");
    if (caja.rowsAffected[0] < 1) {
      return { codigo: 400, mensaje: "La caja no existe" };
    }
    if (caja.recordset[0].Total > 0) {
      return { codigo: 400, mensaje: "La caja ya esta cerrada" };
    }
    return {
      codigo: 200,
      mensaje: "Caja encontrada",
      idCaja: caja.recordset[0].IdCaja,
    };
  } catch (error) {
    console.log(error);
  }
};

//Metodo para crear una cuponera
const crearCuponera = async (cedula, monto, caja) => {
  try {
    //Verifico si la caja esta abierta
    return getCajaPorId(caja.idCaja).then((cajaAbierta) => {
      if (cajaAbierta.codigo === 400) {
        return cajaAbierta;
      } else {
        //Verifico si el cliente ya tiene una cuponera
        return existeCuponera(cedula).then((existe) => {
          if (existe) {
            //Si existe devuelvo mensaje de error
            return { codigo: 400, mensaje: "El cliente ya tiene una cuponera" };
          } else {
            return insertarCuponera(cedula, monto).then((resultado) => {
              if (resultado.rowsAffected[0] < 1) {
                return { codigo: 400, mensaje: "Error al crear cuponera" };
              } else {
                //Hago la entrada de dinero que corresponde a esto
                return nuevaEntradaDinero(
                  caja.idCaja,
                  caja.montoTotal,
                  caja.pago,
                  caja.ciEmpleado,
                  caja.productosVendidos,
                  caja.servicios,
                  caja.descripcion
                ).then((resultado) => {
                  if (resultado.codigo === 200) {
                    return {
                      codigo: 200,
                      mensaje: "Cuponera creada correctamente",
                    };
                  } else {
                    return {
                      codigo: 400,
                      mensaje: "Error al pagar la plata de la cuponera",
                    };
                  }
                });
              }
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para insertar una nueva cuponera
const insertarCuponera = async (cedula, monto) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el insert
    const cuponera = await pool
      .request()
      .input("cedula", sql.VarChar, cedula)
      .input("monto", sql.VarChar, monto)
      .query("insert into Cuponera(Cedula, Monto) values(@cedula, @monto)");
    return cuponera;
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar que devuelve si existe una cuponera segun una cedula
const existeCuponera = async (cedula) => {
  try {
    //Llamo al metodo de get cuponera para ver si me trae algo o no
    const existe = getCuponera(cedula).then((cupo) => {
      if (cupo.rowsAffected[0] === 0) {
        return false;
      }
      return true;
    });
    return existe;
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para ir a buscar una cuponera
const getCuponera = async (cedula) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select
    const cuponera = await pool
      .request()
      .input("cedula", sql.VarChar, cedula)
      .query(
        "select IdCuponera as id, Cedula as cedula, Monto as monto from Cuponera C where C.Cedula = @cedula"
      );
    return cuponera;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para modificar saldo de una cuponera
const modificarSaldoCuponera = async (cedula, monto) => {
  try {
    //Voy a buscar la cuponera
    const retorno = getCuponera(cedula).then(async (resultado) => {
      if (resultado.rowsAffected[0] < 1) {
        return { codigo: 400, mensaje: "El cliente no tiene cuponera" };
      } else {
        //Veo cual va a ser el nuevo monto de la cuponera
        let nuevoSaldo = resultado.recordset[0].monto + monto;
        //Verifico que el monto no sea menor a 0
        if (nuevoSaldo < 0) {
          return {
            codigo: 400,
            mensaje:
              "La cuponera no posee montos suficientes. Saldo actual: $" +
              resultado.recordset[0].monto,
          };
        } else {
          //Hago la modificacion del saldo
          //Creo la conexion
          let pool = await sql.connect(conexion);
          //Hago el update
          const cuponera = await pool
            .request()
            .input("nuevoSaldo", sql.Int, nuevoSaldo)
            .input("cedula", sql.VarChar, cedula)
            .query(
              "update Cuponera set Monto = @nuevoSaldo where Cedula = @cedula"
            );
          if (cuponera.rowsAffected[0] < 1) {
            return {
              codigo: 400,
              mensaje: "Error al modificar saldo de cuponera",
            };
          } else {
            return {
              codigo: 200,
              mensaje: "Saldo modificado correctamente",
              saldoAnterior: resultado.recordset[0].monto,
            };
          }
        }
      }
    });
    if (retorno < 1) {
      return { codigo: 400, mensaje: "Error al modificar saldo de cuponera" };
    } else {
      return retorno;
    }
  } catch (error) {
    console.log(error);
  }
};

//Metodo para modificar la cuponera entera
const updateCuponera = async (ciActual, ciNueva, monto) => {
  try {
    //Verifico si el ciNueva tiene cuponera
    return existeCuponera(ciNueva).then((existe) => {
      if (existe) {
        return { codigo: 400, mensaje: "El nuevo cliente ya tiene cuponera" };
      } else {
        //Verifico si al ciActual tiene cuponera
        return existeCuponera(ciActual).then((existe) => {
          //Si el ciActual no tiene cuponera devuelvo error
          if (!existe) {
            return {
              codigo: 400,
              mensaje: "El cliente actual no tiene cuponera",
            };
          } else {
            //Verifico si tengo que actualizar la cedula o monto individualmente o si tengo que actualizar todo junto
            if (ciNueva === null) {
              //Solamente actualizo el monto
              return updateMontoCuponera(ciActual, monto).then((resultado) => {
                if (resultado === 1) {
                  return {
                    codigo: 200,
                    mensaje: "Saldo modificado correctamente",
                  };
                } else {
                  return { codigo: 400, mensaje: "Error al modificar saldo" };
                }
              });
            } else if (monto === null) {
              //Solamente actualizo el cliente
              return updateClienteCuponera(ciActual, ciNueva).then(
                (resultado) => {
                  if (resultado === 1) {
                    return {
                      codigo: 200,
                      mensaje: "Cliente modificado correctamente",
                    };
                  } else {
                    return {
                      codigo: 400,
                      mensaje: "Error al modificar cliente",
                    };
                  }
                }
              );
            } else {
              //Si entro aca significa de que tengo que actualizar todo de la cuponera
              return updateCuponeraEntero(ciActual, ciNueva, monto).then(
                (resultado) => {
                  if (resultado === 1) {
                    return {
                      codigo: 200,
                      mensaje: "Cuponera modificada correctamente",
                    };
                  } else {
                    return {
                      codigo: 400,
                      mensaje: "Error al modificar cuponera",
                    };
                  }
                }
              );
            }
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para hacer update al saldo de la cuponera
const updateMontoCuponera = async (ci, monto) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el update
    const cuponera = await pool
      .request()
      .input("monto", sql.Int, monto)
      .input("ci", sql.VarChar, ci)
      .query("update Cuponera set Monto = @monto where Cedula = @ci");
    //Devuelvo la cantidad de filas afectadas, siempre deberia ser 1
    return cuponera.rowsAffected[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para hacer update al cliente de la cuponera
const updateClienteCuponera = async (ciActual, ciNueva) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el update
    const cuponera = await pool
      .request()
      .input("ciNueva", sql.VarChar, ciNueva)
      .input("ciActual", sql.VarChar, ciActual)
      .query("update Cuponera set Cedula = @ciNueva where Cedula = @ciActual");
    //Devuelvo la cantidad de filas afectadas, siempre deberia ser 1
    return cuponera.rowsAffected[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para hacer update al cliente de la cuponera
const updateCuponeraEntero = async (ciActual, ciNueva, monto) => {
  try {
    return updateMontoCuponera(ciActual, monto).then((filasAfectadas) => {
      if (filasAfectadas === 1) {
        return updateClienteCuponera(ciActual, ciNueva).then((resultado) => {
          return resultado;
        });
      } else {
        return filasAfectadas;
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//Metodo para consultar el saldo de una cuponera
const getSaldoCuponera = async (cedula) => {
  try {
    return getCuponera(cedula).then((resultado) => {
      if (resultado.rowsAffected[0] === 0) {
        return { codigo: 400, mensaje: "El cliente no tiene una cuponera" };
      } else {
        return { codigo: 200, mensaje: resultado.recordset[0].monto };
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//Metodo para conseguir el idCaja
const getIdCajaHoy = async () => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select
    const idCaja = await pool
      .request()
      .query(
        "select IdCaja as id from Caja C where C.Fecha = CAST(GETDATE() AS DATE)"
      );
    if (idCaja.rowsAffected[0] < 1) {
      return -1;
    } else {
      return idCaja.recordset[0].id;
    }
  } catch (error) {
    console.log(error);
  }
};

//Metodo para la salida de dinero
const nuevaSalidaDinero = async (idCaja, descripcion, monto, fecha, cedula) => {
  try {
    //Primero tengo que hacer el insert en la tabla SalidaDinero
    return insertarSalidaDinero(descripcion, monto, fecha, cedula)
      .then((respuestaSalida) => {
        if (respuestaSalida.filasAfectadas < 1) {
          return {
            codigo: 400,
            mensaje: "Error al insertar la Salida de Dinero",
          };
        } else {
          return insertarCajaSalida(idCaja, respuestaSalida.idSalida);
        }
      })
      .then((respuesta) => {
        if (respuesta < 1) {
          return {
            codigo: 400,
            mensaje: "Error al insertar la Salida en la Caja ",
          };
        } else {
          return {
            codigo: 200,
            mensaje: "Salida de dinero registrada correctamente",
          };
        }
      });
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para insertar en la tabla SalidaDinero
const insertarSalidaDinero = async (descripcion, monto, fecha, cedula) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el insert
    const salida = await pool
      .request()
      .input("descripcion", sql.VarChar, descripcion)
      .input("monto", sql.Int, monto)
      .input("fecha", sql.Date, fecha)
      .input("cedula", sql.VarChar, cedula)
      .query(
        "insert into SalidaDinero (Descripcion, Monto, Fecha, Cedula) output inserted.IdSalida values(@descripcion, @monto, @fecha, @cedula)"
      );
    //Devuelvo la cantidad de filas afectadas y el idSalida
    return {
      filasAfectadas: salida.rowsAffected[0],
      idSalida: salida.recordset[0].IdSalida,
    };
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para insertar en la tabla Caja_Salida
const insertarCajaSalida = async (idCaja, idSalida) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el insert
    const resultado = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .input("idSalida", sql.Int, idSalida)
      .query(
        "insert into Caja_Salida (IdCaja, IdSalida) values(@idCaja, @idSalida)"
      );
    //Devuelvo la cantidad de filas afectadas y el idSalida
    return resultado.rowsAffected[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo para cerrar la caja
const cierreCaja = async (idCaja) => {
  //Me llega el idCaja en base a eso llamo a los totales de cada medio de pago
  //Armo un array para guardar todas las promesas asi las resuelvo todas juntas
  let listadoPromesas = [];
  //Llamo a todos los metodos que me traen los datos de los pagos
  const promesaEfectivo = getTotalEfectivos(idCaja);
  const promesaDebito = getTotalDebitos(idCaja);
  const promesaCuponera = getTotalCuponera(idCaja);
  //Agrego todas las promesas al listado de promesas
  listadoPromesas.push(promesaEfectivo, promesaDebito, promesaCuponera);
  //Las resuelvo todas
  return Promise.allSettled(listadoPromesas).then(async (resultados) => {
    //Armo el objeto que voy a devolver
    let retorno = {};
    resultados.forEach((promesa) => {
      switch (promesa.value.promesa) {
        case "Efectivo":
          retorno = { ...retorno, efectivo: promesa.value.efectivo };
          break;

        case "Cuponera":
          retorno = { ...retorno, cuponera: promesa.value.cuponera };
          break;

        case "Debito":
          retorno = { ...retorno, debito: promesa.value.debito };
          break;
        default:
          break;
      }
    });
    //Voy a buscar todas las salidas
    const salidas = await getSalidasDineroEmpleados(idCaja);
    return { entradas: retorno, salidas: salidas };
  });
};

//Metodo auxiliar para conseguir el total de efectivos de una caja en particular
const getTotalEfectivos = async (idCaja) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Cantidad de pagos con efectivo de atenciones y productos
    const normales = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .query(
        "select SUM(EE.Monto) as total, COUNT(E.IdEntrada) as cantidad from EntradaDinero E, Entrada_Efectivo EE, Caja_Entrada C where E.IdEntrada = EE.IdEntrada and E.IdEntrada = C.IdEntrada and EE.IdMedioPago = 1 and E.Descripcion is null and C.IdCaja = @idCaja"
      );
    //Cantidad de entrada de caja
    const aperturaCaja = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .query(
        "select SUM(EE.Monto) as total, COUNT(E.IdEntrada) as cantidad from EntradaDinero E, Entrada_Efectivo EE, Caja_Entrada C where E.IdEntrada = EE.IdEntrada and E.IdEntrada = C.IdEntrada and EE.IdMedioPago = 1 and E.Descripcion = 'A' and C.IdCaja = @idCaja"
      );
    //Cantidad de pagos con efectivo para crear cuponeras
    const cuponerasCreadas = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .query(
        "select SUM(EE.Monto) as total, COUNT(E.IdEntrada) as cantidad from EntradaDinero E, Entrada_Efectivo EE, Caja_Entrada C where E.IdEntrada = EE.IdEntrada and E.IdEntrada = C.IdEntrada and EE.IdMedioPago = 1 and E.Descripcion = 'C' and C.IdCaja = @idCaja"
      );
    //Cantidad de pagos con efectivo para cargar cuponeras
    const agregadoSaldoCuponera = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .query(
        "select SUM(EE.Monto) as total, COUNT(E.IdEntrada) as cantidad from EntradaDinero E, Entrada_Efectivo EE, Caja_Entrada C where E.IdEntrada = EE.IdEntrada and E.IdEntrada = C.IdEntrada and EE.IdMedioPago = 1 and E.Descripcion = 'X' and C.IdCaja = @idCaja"
      );
    //Armo un objeto con todos los datos
    let cobrosEfectivo = {
      //A este array le voy a agregar los objetos anteriores
      efectivo: [],
      promesa: "Efectivo",
    };
    //Agrego al array que voy a devolver
    cobrosEfectivo.efectivo.push(
      {
        total:
          normales.recordset[0].total === null
            ? 0
            : normales.recordset[0].total,
        cantidad: normales.recordset[0].cantidad,
        mensaje: "Cobros de atenciones o productos",
      },
      {
        total:
          aperturaCaja.recordset[0].total === null
            ? 0
            : aperturaCaja.recordset[0].total,
        cantidad: aperturaCaja.recordset[0].cantidad,
        mensaje: "Monto de apertura de caja",
      },
      {
        total:
          cuponerasCreadas.recordset[0].total === null
            ? 0
            : cuponerasCreadas.recordset[0].total,
        cantidad: cuponerasCreadas.recordset[0].cantidad,
        mensaje: "Creaciones de cuponera",
      },
      {
        total:
          agregadoSaldoCuponera.recordset[0].total === null
            ? 0
            : agregadoSaldoCuponera.recordset[0].total,
        cantidad: agregadoSaldoCuponera.recordset[0].cantidad,
        mensaje: "Carga de saldo a cuponeras",
      }
    );
    //Armo un objeto con el total de los efectivos, ya que es el que esta separado
    let totalEfectivo = {
      total: 0,
    };
    //Recorro todos los pagos para sumarlos y tener el total
    cobrosEfectivo.efectivo.forEach((pagos) => {
      totalEfectivo.total += pagos.total;
    });
    cobrosEfectivo.efectivo.push(totalEfectivo);
    return cobrosEfectivo;
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para conseguir el total de debitos de una caja en particular
const getTotalDebitos = async (idCaja) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Cantidad de pagos con debito
    const debitos = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .query(
        "select SUM(EE.Monto) as total, COUNT(E.IdEntrada) as cantidad from EntradaDinero E, Entrada_Debito EE, Caja_Entrada C where E.IdEntrada = EE.IdEntrada and E.IdEntrada = C.IdEntrada and EE.IdMedioPago = 2 and E.Descripcion is null and C.IdCaja = @idCaja"
      );
    //Armo un objeto con todos los datos
    let cobrosDebito = {
      //Para este caso no seria necesario dejarlo como array, pero sirve para que esto sea escalable
      debito: [],
      promesa: "Debito",
    };
    cobrosDebito.debito.push({
      total:
        debitos.recordset[0].total === null ? 0 : debitos.recordset[0].total,
      cantidad: debitos.recordset[0].cantidad,
      mensaje: "Cobros de atenciones o productos",
    });
    //Armo un objeto con el total de los efectivos, ya que es el que esta separado
    let totalDebito = {
      total: 0,
    };
    //Recorro todos los pagos para sumarlos y tener el total
    cobrosDebito.debito.forEach((pagos) => {
      totalDebito.total += pagos.total;
    });
    cobrosDebito.debito.push(totalDebito);
    return cobrosDebito;
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para conseguir el total de pagos con cuponera de una caja en particular
const getTotalCuponera = async (idCaja) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Cantidad de pagos con cuponera
    const cuponeras = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .query(
        "select SUM(EE.Monto) as total, COUNT(E.IdEntrada) as cantidad from EntradaDinero E, Entrada_Efectivo EE, Caja_Entrada C where E.IdEntrada = EE.IdEntrada and E.IdEntrada = C.IdEntrada and EE.IdMedioPago = 3 and E.Descripcion is null and C.IdCaja = @idCaja"
      );
    //Armo un objeto con todos los datos
    let cobrosCuponera = {
      //Para este caso no seria necesario dejarlo como array, pero sirve para que esto sea escalable
      cuponera: [],
      promesa: "Cuponera",
    };
    cobrosCuponera.cuponera.push({
      total:
        cuponeras.recordset[0].total === null
          ? 0
          : cuponeras.recordset[0].total,
      cantidad: cuponeras.recordset[0].cantidad,
      mensaje: "Cobros de atenciones o productos",
    });
    //Armo un objeto con el total de los efectivos, ya que es el que esta separado
    let totalCuponera = {
      total: 0,
    };
    //Recorro todos los pagos para sumarlos y tener el total
    cobrosCuponera.cuponera.forEach((pagos) => {
      totalCuponera.total += pagos.total;
    });
    cobrosCuponera.cuponera.push(totalCuponera);
    return cobrosCuponera;
  } catch (error) {
    console.log(error);
  }
};

//Conseguir datos para formularios
const getDatosFormularioModificarAgenda = async (idAgenda) => {
  let retorno = getEmpleadosFormulario()
    .then((listadoEmpleados) => {
      return agregarDuracionEmpleados(listadoEmpleados);
    })
    .then((listadoEmpleadosDuracion) => {
      return agregarFechasEmpleadosModificar(
        listadoEmpleadosDuracion,
        idAgenda
      );
    })
    .then((listadoEmpleadosConFecha) => {
      return agregarHorariosEmpleadoModificar(
        listadoEmpleadosConFecha,
        idAgenda
      );
    })
    .then((listadoCompleto) => {
      return agregarServiciosRetorno(listadoCompleto);
    })
    .then((listadoConServicios) => listadoConServicios);
  return retorno;
};

//Metodo para cambiar el manejo de agendas
const updateManejarAgenda = async (valor) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el update
    const resultado = await pool
      .request()
      .input("valor", sql.Int, valor)
      .query("update ManejarAgendas set AceptarRechazar = @valor");
    return {
      codigo: 200,
      mensaje: "Manejo de agendas actualizado correctamente",
      valor: valor,
    };
  } catch (error) {
    console.log(error);
    return {
      codigo: 400,
      mensaje: "Error al actualizar el manejo de agendas",
    };
  }
};

//Metodo para agregarle las fechas agendadas a los
//Espero que me llegue un listado de empleados
//Devuelve una promesa
const agregarFechasEmpleadosModificar = async (listadoEmpleados, idAgenda) => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Voy a buscar las fechas de todas las agendas aceptadas
    const fechasAgenda = await pool
      .request()
      .input("idAgenda", sql.Int, idAgenda)
      .query(
        "select E.Cedula, H.Fecha from Empleado E, Agenda A, Horario H where E.Cedula = H.Cedula and A.IdHorario = H.IdHorario and A.Aceptada = 1 and A.IdAgenda <> @idAgenda group by H.Fecha, E.Cedula"
      );
    //Armo el array de retorno
    let arrayRetorno = [];
    //Recorro todos los empleados y por cada uno le agrego las fechas de las agendas
    for (let i = 0; i < listadoEmpleados.length; i++) {
      //Armo un empleado aux que tiene un array de fechas
      let empleadoAux = {
        ...listadoEmpleados[i],
        fechas: [],
      };
      //Recorro las fechas de las agendas para agregarlas
      for (let j = 0; j < fechasAgenda.recordset.length; j++) {
        if (empleadoAux.id === fechasAgenda.recordset[j].Cedula) {
          //Creo el objeto fecha para agregar al empleado
          let fechaAux = {
            dia: fechasAgenda.recordset[j].Fecha.getUTCDate(),
            mes: fechasAgenda.recordset[j].Fecha.getMonth() + 1,
            horarios: [],
          };
          empleadoAux.fechas.push(fechaAux);
        }
      }
      arrayRetorno.push(empleadoAux);
    }
    return arrayRetorno;
  } catch (error) {
    console.log(error);
  }
};
//Metodo para agregar los horarios de las agendas al empleado
//Me llega un empleado y le tengo que agregar los horarios a ese empleado
//Devuelve una promesa
const agregarHorariosEmpleadoModificar = async (listadoEmpleados, idAgenda) => {
  try {
    //variable que tiene la conexion
    const pool = await sql.connect(conexion);
    //Consigo los datos de los horarios
    const horarios = await pool
      .request()
      .input("idAgenda", sql.Int, idAgenda)
      .query(
        "select H.IdHorario, H.Cedula, H.HoraInicio, H.HoraFin, H.Fecha from Horario H, Agenda A where H.IdHorario = A.IdHorario and A.Aceptada = 1 and A.Aceptada = 1 and A.IdAgenda <> @idAgenda order by Cedula, HoraInicio"
      );
    //Recorro todos los empleados para ir agregando uno por uno sus horarios
    for (let k = 0; k < listadoEmpleados.length; k++) {
      //Recorro las fechas del empleado en el cual estoy parado
      for (let j = 0; j < listadoEmpleados[k].fechas.length; j++) {
        //Recorro el array de horarios para ver cuales le tengo que asignar
        for (let i = 0; i < horarios.recordset.length; i++) {
          //Tengo que verificar de que la fecha del horario sea la fecha correspondiente
          if (
            listadoEmpleados[k].fechas[j].dia ===
              horarios.recordset[i].Fecha.getUTCDate() &&
            listadoEmpleados[k].fechas[j].mes ===
              horarios.recordset[i].Fecha.getMonth() + 1 &&
            horarios.recordset[i].Cedula == listadoEmpleados[k].id
          ) {
            //Creo objeto auxiliar horario para agregar
            let horarioAux = {
              i: horarios.recordset[i].HoraInicio,
              f: horarios.recordset[i].HoraFin,
            };
            listadoEmpleados[k].fechas[j].horarios.push(horarioAux);
          }
        }
      }
    }
    return listadoEmpleados;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para modificar stock de un listado de productos
//El listado de productos tiene objeto producto con id y cantidad a sacar
const modificarStockListadoProducto = async (listadoProducto) => {
  try {
    let listadoPromesa = [];
    listadoProducto.forEach((producto) => {
      listadoPromesa.push(
        modificarStockProducto(producto.idProducto, producto.cantidad)
      );
    });
    return Promise.allSettled(listadoPromesa)
      .then((resultados) => {
        let salioBien = true;
        resultados.forEach((promesa) => {
          if (promesa.value.codigo !== 200) {
            salioBien = false;
          }
        });
        return salioBien;
      })
      .then((resultado) => {
        if (resultado) {
          return { codigo: 200, mensaje: "Stock modificado correctamente" };
        } else {
          return {
            codigo: 400,
            mensaje: "Error al modificar el stock de los productos",
          };
        }
      });
  } catch (error) {
    console.log(error);
  }
};

//Metodo para modificar stock de producto
const modificarStockProducto = async (idProducto, cantidad) => {
  try {
    //Voy a buscar el producto que quiero modificarle el stock
    return getProductoPorId(idProducto).then((producto) => {
      //Ahora que tengo el producto quiero saber cual va a ser el nuevo stock
      //En caso de que el stock sea < 0 devuelvo error
      let nuevoStock = producto.Stock - cantidad;
      if (nuevoStock < 0) {
        return {
          codigo: 400,
          mensaje: "Stock insuficiente",
          producto: producto.IdProducto,
        };
      } else {
        //Si entro aca significa de que tengo stock suficiente para vender entonces los descuento
        return updateStockProducto(idProducto, nuevoStock).then(
          (resultado) => resultado
        );
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para conseguir un producto por su id
const getProductoPorId = async (idProducto) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el update
    const producto = await pool
      .request()
      .input("idProducto", sql.Int, idProducto)
      .query("select * from Producto where IdProducto = @idProducto");
    return producto.recordset[0];
  } catch (error) {
    console.log();
  }
};

//Metodo auxiliar para modificar stock de un producto
const updateStockProducto = async (idProducto, nuevaCantidad) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el update
    const resultado = await pool
      .request()
      .input("idProducto", sql.Int, idProducto)
      .input("nuevaCantidad", sql.Int, nuevaCantidad)
      .query(
        "update Producto set Stock = @nuevaCantidad where IdProducto = @idProducto"
      );
    return {
      codigo: 200,
      mensaje: "Stock modificado correctamente",
      filasAfectadas: resultado.rowsAffected[0],
    };
  } catch (error) {
    console.log();
  }
};

//Metodo para modificar el producto entero
const updateProducto = async (
  idProducto,
  nombre,
  stock,
  precio,
  discontinuado
) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el update
    const resultado = await pool
      .request()
      .input("idProducto", sql.Int, idProducto)
      .input("nombre", sql.VarChar, nombre)
      .input("stock", sql.Int, stock)
      .input("precio", sql.Int, precio)
      .input("discontinuado", sql.Bit, discontinuado)
      .query(
        "update Producto set Stock = @stock, Nombre = @nombre, Precio = @precio, Discontinuado = @discontinuado  where IdProducto = @idProducto"
      );
    if (resultado.rowsAffected[0] < 1) {
      return {
        codigo: 400,
        mensaje: "Error al modificar producto",
      };
    } else {
      return {
        codigo: 200,
        mensaje: "Producto modificado correctamente",
        filasAfectadas: resultado.rowsAffected[0],
      };
    }
  } catch (error) {
    console.log();
  }
};

//Metodo para controlar cosas antes de la entrada de dinero
//Se va a verificar que la agenda a eliminar exista, que haya saldo suficiente en la cuponera y haya stock suficiente de los articulos
//El listado de productos tiene id del producto y cantidad
//Los parametros pueden o no venir todos. Si no vienen, me mandan -1
//Yo devuelvo null en caso de que alguno no corresponda
const verificacionEntradaCaja = async (
  idAgenda,
  listadoProductos,
  ciCliente,
  monto
) => {
  try {
    //Armo un listado de promesas
    let listadoPromesas = [];
    //Aca llamo a los metodos en particular para verificar que exista cada cosa
    //Voy a llamar a todas las promesas y despues las voy a agregar a un listado al cual le hago Promise.all
    if (idAgenda !== -1) {
      const promesaAgenda = existeAgenda(idAgenda);
      listadoPromesas.push(promesaAgenda);
    }
    if (listadoProductos !== -1) {
      const promesaStock = verificarStockListadoProductos(listadoProductos);
      listadoPromesas.push(promesaStock);
    }
    if (ciCliente !== -1) {
      const promesaCuponera = existeSaldoClienteCuponera(ciCliente, monto);
      listadoPromesas.push(promesaCuponera);
    }
    //Manejo todas las promesas
    return Promise.allSettled(listadoPromesas)
      .then((resultados) => {
        let retorno = {};
        resultados.forEach((promesa) => {
          switch (promesa.value.promesa) {
            case "Producto":
              retorno = { ...retorno, producto: promesa.value };
              break;

            case "Cuponera":
              retorno = { ...retorno, cuponera: promesa.value };
              break;

            case "Agenda":
              retorno = { ...retorno, agenda: promesa.value };
              break;
            default:
              break;
          }
        });
        return retorno;
      })
      .then((retorno) => retorno);
  } catch (error) {
    console.log(error);
  }
};

//Metodo para ver si existe la agenda
const existeAgenda = async (idAgenda) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select
    const resultado = await pool
      .request()
      .input("idAgenda", sql.Int, idAgenda)
      .query("select * from Agenda where IdAgenda = @idAgenda");
    if (resultado.rowsAffected[0] < 1) {
      return {
        codigo: 400,
        mensaje: "La agenda ya fue eliminada",
        promesa: "Agenda",
      };
    }
    return { codigo: 200, mensaje: "", promesa: "Agenda" };
  } catch (error) {
    console.log(error);
  }
};

//Metodo para verificar saldo y cliente de una cuponera
const existeSaldoClienteCuponera = async (cedula, monto) => {
  try {
    return getCuponera(cedula).then((cuponera) => {
      if (cuponera.rowsAffected[0] < 1) {
        return {
          codigo: 400,
          mensaje: "No existe cuponera para ese cliente",
          promesa: "Cuponera",
        };
      } else {
        if (cuponera.recordset[0].monto < monto) {
          return {
            codigo: 400,
            mensaje: "Saldo insuficiente",
            promesa: "Cuponera",
          };
        } else {
          return { codigo: 200, mensaje: "", promesa: "Cuponera" };
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//Metodo para ver si hay stock suficiente para ese producto
const existeStockSuficiente = async (idProducto, cantidad) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select
    const resultado = await pool
      .request()
      .input("idProducto", sql.Int, idProducto)
      .query("select * from Producto where IdProducto = @idProducto");
    if (resultado.recordset[0].Stock < cantidad) {
      return { codigo: 400, mensaje: "Stock insuficiente" };
    }
    return { codigo: 200, mensaje: "" };
  } catch (error) {
    console.log(error);
  }
};

//Metodo para verificar si hay stock suficiente de todos los productos de un listado
//Con que haya uno que al menos no tenga stock suficiente devuelve error
//El listado de productos tiene objetos producto con idProducto y cantidad requerida
const verificarStockListadoProductos = async (listadoProductos) => {
  try {
    let listadoPromesas = [];
    listadoProductos.forEach((producto) => {
      listadoPromesas.push(existeStockSuficiente(producto.id, producto.stock));
    });
    return Promise.allSettled(listadoPromesas).then((resultados) => {
      let hayStock = true;
      for (let i = 0; i < resultados.length; i++) {
        if (resultados[i].value.codigo === 400) {
          hayStock = false;
          break;
        }
      }
      if (hayStock) {
        return { codigo: 200, mensaje: "", promesa: "Producto" };
      } else {
        return {
          codigo: 400,
          mensaje: "Stock insuficiente",
          promesa: "Producto",
        };
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//Metodo para crear un nuevo producto
//Los productos nuevos se crean con stock 0 por las dudas
const crearNuevoProducto = async (nombre, precio, stock, descontinuado) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el insert
    const producto = await pool
      .request()
      .input("precio", sql.Int, precio)
      .input("nombre", sql.VarChar, nombre)
      .input("stock", sql.Int, stock)
      .input("descontinuado", sql.Bit, descontinuado)
      .query(
        "insert into Producto (Nombre, Stock, Precio, Discontinuado) values (@nombre, @stock, @precio, @descontinuado)"
      );
    if (producto.rowsAffected < 1) {
      return { codigo: 400, mensaje: "Error al crear producto" };
    } else {
      return { codigo: 200, mensaje: "Producto creado correctamente" };
    }
  } catch (error) {
    console.log(error);
  }
};

//Metodo para conseguir las agendas de un cliente
const getAgendasCliente = async (cedula) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select
    const agendas = await pool
      .request()
      .input("cedula", sql.VarChar, cedula)
      .query(
        "select H.Fecha as fecha, H.HoraInicio as horaInicio, H.HoraFin as horaFin, A.IdAgenda as idAgenda, A.IdHorario as idHorario, A.Descripcion as descripcion, E.Nombre as nombreEmpleado from Agenda A, Agenda_Cliente AC, Horario H, Empleado E where A.IdHorario = H.IdHorario and AC.IdAgenda = A.IdAgenda and E.Cedula = H.Cedula and AC.Cedula = @cedula"
      );
    if (agendas.rowsAffected < 1) {
      return { codigo: 400, mensaje: "No hay ninguna agenda" };
    } else {
      return { codigo: 200, mensaje: agendas.recordset };
    }
  } catch (error) {}
};

//Metodo auxiliar para conseguir todos los servicios de las agendas de clientes
const getAllServiciosAgendaClientes = async (cedula) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select
    const servicios = await pool
      .request()
      .input("cedula", sql.VarChar, cedula)
      .query(
        "select AC.IdAgenda as idAgenda, SA.IdServicio as idServicio from Agenda_Cliente AC, Agenda_Servicio SA where AC.IdAgenda = SA.IdAgenda and AC.Cedula = @cedula"
      );
    return servicios.recordset;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para juntar todas las agendas de un cliente con los servicios de esa agenda
//Recibo la cedula de un cliente y con eso llamo a los otros metodos
const juntarAgendasServicioCliente = async (cedula) => {
  try {
    const agendas = await getAgendasCliente(cedula);
    const servicios = await getAllServiciosAgendaClientes(cedula);
    //Pregunto sin hay alguna agenda
    if (agendas.codigo === 400) {
      return agendas;
    } else {
      //Armo un array que voy a devolver
      let arrayRetorno = [];
      //Si hay agendas entonces las recorro para despues recorrer los servicios
      for (let i = 0; i < agendas.mensaje.length; i++) {
        //Armo el objeto de la agenda que voy a devolver y que le voy a agregar los servicios
        let agendaAux = { ...agendas.mensaje[i], servicios: [] };
        for (let k = 0; k < servicios.length; k++) {
          if (agendas.mensaje[i].idAgenda === servicios[k].idAgenda) {
            //Agrego el servicio a el listado de servicios
            agendaAux.servicios.push(servicios[k].idServicio);
          }
        }
        arrayRetorno.push(agendaAux);
      }
      return arrayRetorno;
    }
  } catch (error) {
    console.log(error);
  }
};

//Metodo para cambiar la opcion de deshabilitado de un usuario
const updateHabilitarEmpleado = async (cedula, hab) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el update
    const ret = await pool
      .request()
      .input("cedula", sql.VarChar, cedula)
      .input("hab", sql.Bit, hab)
      .query("update Empleado set Habilitado = @hab where Cedula = @cedula");
    if (hab === 1) {
      return { codigo: 200, mensaje: "Empleado habilitado correctamente" };
    } else {
      return { codigo: 200, mensaje: "Empleado deshabilitado correctamente" };
    }
  } catch (error) {
    console.log(error);
    return { codigo: 400, mensaje: "Error al habilitar/deshabilitar empleado" };
  }
};

//Metodo devolver todos empleados con la opcion de habilitados
const listadoEmpleadosHabilitacion = async () => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el update
    const ret = await pool
      .request()
      .query(
        "select E.Cedula as id, E.Nombre as title, E.Habilitado as habilitado, ER.IdRol as idRol from Empleado E, Empleado_Rol ER where E.Cedula = ER.Cedula"
      );
    return { codigo: 200, mensaje: ret.recordset };
  } catch (error) {
    console.log(error);
    return { codigo: 400, mensaje: "Error al ir a buscar los empleados" };
  }
};

//Metodo para establecer que un usuario necesita cambiar su pass
const insertarCambiarContra = async (cedula) => {
  try {
    //Verifico de si ya se reseteo la clave
    const yaCambio = await debeCambiarContra(cedula);
    if (yaCambio) {
      return { codigo: 201, mensaje: "La clave ya fue reseteada" };
    } else {
      //Creo la conexion
      let pool = await sql.connect(conexion);
      //Hago el update
      const ret = await pool
        .request()
        .input("cedula", sql.VarChar, cedula)
        .query(
          "insert into ReseteoClave (Cedula, DebeCambiar) values (@cedula, 1)"
        );
      //Voy a buscar los datos del cliente
      const cliente = await pool
        .request()
        .input("cedula", sql.VarChar, cedula)
        .query(
          "select Nombre as nombre, Tel as tel from Cliente where Cedula = @cedula"
        );
      if (cliente.rowsAffected[0] < 1) {
        return { codigo: 200, mensaje: "Se reseteo la clave correctamente" };
      } else {
        return {
          codigo: 200,
          mensaje: "Se reseteo la clave correctamente",
          cliente: cliente.recordset[0],
        };
      }
    }
  } catch (error) {
    console.log(error);
    return { codigo: 400, mensaje: "Algo salio mal" };
  }
};

//Metodo auxiliar para eliminar de la tabla ReseteoClave
const deleteCambiarContra = async (cedula) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el update
    const ret = await pool
      .request()
      .input("cedula", sql.VarChar, cedula)
      .query("delete from ReseteoClave where Cedula = @cedula");
    return { codigo: 200, mensaje: "ReseteoClave elminado correctamente" };
  } catch (error) {
    console.log(error);
    return { codigo: 400, mensaje: "Algo salio mal" };
  }
};

//Metodo para poner una nueva pass que el usuario quiera
const nuevaContra = async (cedula, contra, identificadorUsu) => {
  try {
    //Primero hago el update de la contra
    const cambioContra = await updateContra(cedula, contra, identificadorUsu);
    if (cambioContra.codigo === 400) {
      //Si dio error devuelvo que dio error
      return cambioContra;
    }
    //Hago el delete de la tabla ReseteoClave
    const noCambiarContra = await deleteCambiarContra(cedula);
    if (noCambiarContra.codigo === 400) {
      //Si dio error devuelvo que dio error
      return cambioContra;
    }
    return { codigo: 200, mensaje: "Clave Modificada Correctamente" };
  } catch (error) {
    console.log(error);
  }
};

//Metodo para modificar la pass de un empleado
//El identificadorUsu va a ser 1 para Empleados y 2 para Clientes
const updateContra = async (cedula, contra, identificadorUsu) => {
  try {
    //Verifico si va a ser Empleado o Cliente al que le tengo que cambiar la contra
    let queryUpdate = "";
    if (identificadorUsu === 1) {
      //Armo la query que voy a hacer
      queryUpdate =
        "update Empleado set Contra = @contra where Cedula = @cedula";
    } else if (identificadorUsu === 2) {
      queryUpdate =
        "update Cliente set Contra = @contra where Cedula = @cedula";
    }
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el update
    const ret = await pool
      .request()
      .input("cedula", sql.VarChar, cedula)
      .input("contra", sql.VarChar, contra)
      .query(queryUpdate);
    return { codigo: 200, mensaje: "Clave modificada correctamente" };
  } catch (error) {
    console.log(error);
    return { codigo: 400, mensaje: "Algo salio mal" };
  }
};

//Metodo para establecer que un usuario deba cambiar la contra
const reestablecerContra = async (cedula, contra, identificadorUsu) => {
  try {
    return existeClienteEmpleado(cedula, identificadorUsu).then((existe) => {
      if (existe) {
        return updateContra(cedula, contra, identificadorUsu).then(
          (resultado) => {
            if (resultado.codigo === 200) {
              return insertarCambiarContra(cedula).then((resFinal) => resFinal);
            } else {
              return { codigo: 400, mensaje: "Error al modificar contra" };
            }
          }
        );
      } else {
        return { codigo: 400, mensaje: "El usuario no existe" };
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//Metodo para verificar si el usuario debe cambiar la contra o no
const debeCambiarContra = async (cedula) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el update
    const ret = await pool
      .request()
      .input("cedula", sql.VarChar, cedula)
      .query("select * from ReseteoClave where Cedula = @cedula");
    if (ret.rowsAffected[0] > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return { codigo: 400, mensaje: "Algo salio mal" };
  }
};

//Metodo para verificar si existe el cliente o el empleado
const existeClienteEmpleado = async (cedula, identificador) => {
  try {
    //Verifico si va a ser Empleado o Cliente al que le tengo que cambiar la contra
    let querySelect = "";
    if (identificador === 1) {
      //Armo la query que voy a hacer
      querySelect = "select * from Empleado where Cedula = @cedula";
    } else if (identificador === 2) {
      querySelect = "select * from Cliente where Cedula = @cedula";
    }
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select
    const ret = await pool
      .request()
      .input("cedula", sql.VarChar, cedula)
      .query(querySelect);
    if (ret.rowsAffected < 1) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

//Metodo para discontinuar un producto
const discontinuarProducto = async (idProducto, discontinuar) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el update
    const ret = await pool
      .request()
      .input("idProducto", sql.Int, idProducto)
      .input("discontinuar", sql.Bit, discontinuar)
      .query(
        "update Producto set Discontinuado = @discontinuar where IdProducto = @idProducto"
      );
    return { codigo: 200, mensaje: "Producto modificado correctamente" };
  } catch (error) {
    console.log(error);
    return { codigo: 400, mensaje: "Error al discontinuar producto" };
  }
};

//Metodo para calcular las propinas hasta el momento de un empleado
const calcularPropina = async (ciEmpleado) => {
  try {
    //Voy a buscar la caja para usarla
    const caja = await getCaja();
    if (caja.rowsAffected[0] < 1) {
      return { codigo: 400, mensaje: "No hay caja abierta" };
    } else {
      if (caja.recordset[0].total !== 0) {
        return {
          codigo: 400,
          mensaje: "No hay caja abierta, debe abrir la caja primero",
        };
      } else {
        //Creo la conexion
        let pool = await sql.connect(conexion);
        //Hago el select
        const propinas = await pool
          .request()
          .input("idCaja", sql.Int, caja.recordset[0].idCaja)
          .input("ciEmpleado", sql.VarChar, ciEmpleado)
          .query(
            "select SUM(E.Propina) as totalPropinas from EntradaDinero E, Empleado EP, Caja_Entrada C where E.Cedula = EP.Cedula and C.IdEntrada = E.IdEntrada and E.Cedula = @ciEmpleado and C.IdCaja = @idCaja"
          );
        if (propinas.rowsAffected[0] < 1) {
          return { codigo: 400, mensaje: "Error al ir a buscar las propinas" };
        } else {
          //Verifico que la propina no sea null
          let propina = 0;
          if (propinas.recordset[0].totalPropinas !== null) {
            propina = propinas.recordset[0].totalPropinas;
          }
          return {
            codigo: 200,
            mensaje: propina,
          };
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//Metodo para calcular las comisiones de un empleado hasta el momento
const calcularComision = async (ciEmpleado) => {
  try {
    //Voy a buscar la caja
    const caja = await getCaja();
    if (caja.rowsAffected[0] < 1) {
      return { codigo: 400, mensaje: "No hay caja abierta" };
    } else {
      if (caja.recordset[0].total !== 0) {
        return {
          codigo: 400,
          mensaje: "No hay caja abierta, debe abrir la caja primero",
        };
      } else {
        //Voy a buscar el total de comision sin limite del empleado
        const comisionSinLimite = await calcularComisionSinLimite(
          ciEmpleado,
          caja.recordset[0].idCaja
        );
        //Voy a buscar el total de comision con limite del empleado
        const comisionConLimite = await calcularComisionConLimite(
          ciEmpleado,
          caja.recordset[0].idCaja
        );
        //Voy a buscar el total de comision de productos
        const comisionProductos = await calcularComisionProductos(
          ciEmpleado,
          caja.recordset[0].idCaja
        );
        //Hago la suma de las comisiones
        let comisionTotal =
          comisionConLimite.mensaje +
          comisionSinLimite.mensaje +
          comisionProductos.mensaje;
        return { codigo: 200, mensaje: comisionTotal };
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//Metodo para calcular la comision para productos
const calcularComisionProductos = async (ciEmpleado, idCaja) => {
  try {
    //Tengo que ir a buscar los productos vendidos, sus cantidas y su precio
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select
    const productos = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .input("ciEmpleado", sql.VarChar, ciEmpleado)
      .query(
        "select SUM(EP.Cantidad) as totalVendidos, EP.IdProducto as idProducto, E.Cedula as ciEmpleado, P.Precio as precio from EntradaDinero E, Entrada_Producto EP, Producto P, Caja_Entrada C where E.IdEntrada = EP.IdEntrada and P.IdProducto = EP.IdProducto and C.IdEntrada = E.IdEntrada and E.Cedula = @ciEmpleado and C.IdCaja = @idCaja group by P.Nombre, EP.IdProducto, E.Cedula, P.Precio"
      );
    //Agarro el array que me devuelve
    const arrayProductos = productos.recordset;
    //Guardo el valor al que le voy a sumar el total de la comision
    let totalComision = 0;
    arrayProductos.forEach((producto) => {
      totalComision += producto.totalVendidos * producto.precio * 0.1;
    });
    return { codigo: 200, mensaje: totalComision };
  } catch (error) {
    console.log(error);
  }
};

//Metodo para calcular la comision de los que corresponden siempre el 35%
const calcularComisionSinLimite = async (ciEmpleado, idCaja) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select
    const comisionesSinLimite = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .input("ciEmpleado", sql.VarChar, ciEmpleado)
      .query(
        "select COUNT(ES.IdEntrada) as cantidad, ES.IdServicio as idServicio from EntradaDinero E, Entrada_Servicio ES, Caja_Entrada CE where E.IdEntrada = ES.IdEntrada and ES.IdServicio in (6, 7, 8) and CE.IdEntrada = E.IdEntrada and E.Cedula = @ciEmpleado and CE.IdCaja = @idCaja group by ES.IdServicio"
      );
    //Separo la cantidad de servicios que hizo
    let cantServiciosRealizados = comisionesSinLimite.recordset;
    //Voy a buscar los precios de estos servicios en particular
    const precioServicios = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .input("ciEmpleado", sql.VarChar, ciEmpleado)
      .query(
        "select IdServicio, Precio from Servicio where IdServicio in (6, 7, 8)"
      );
    //Separo los precios de esos servicios
    let claritos = { precio: 0, id: 6 };
    let brushing = { precio: 0, id: 8 };
    let deco = { precio: 0, id: 7 };
    //Recorro los servicios para ponerle precio a las variables
    precioServicios.recordset.forEach((servicio) => {
      switch (servicio.IdServicio) {
        case 6:
          claritos.precio = servicio.Precio;
          break;
        case 7:
          deco.precio = servicio.Precio;
          break;
        case 8:
          brushing.precio = servicio.Precio;
          break;
        default:
          break;
      }
    });
    //Armo un total que es lo que voy a devolver
    let totalComision = 0;
    //Recorro los servicios que haya realizado para calcular
    cantServiciosRealizados.forEach((serviciosHechos) => {
      switch (serviciosHechos.idServicio) {
        case 6:
          totalComision += serviciosHechos.cantidad * claritos.precio;
          break;
        case 7:
          totalComision += serviciosHechos.cantidad * deco.precio;
          break;
        case 8:
          totalComision += serviciosHechos.cantidad * brushing.precio;
          break;
        default:
          break;
      }
    });
    return {
      codigo: 200,
      mensaje: totalComision * 0.35,
    };
  } catch (error) {
    console.log(error);
    return {
      codigo: 400,
      mensaje: "Error al calcular la comision sin limites",
    };
  }
};

//Metodo para calcular la comision que corresponde a partir de las 10 atenciones
const calcularComisionConLimite = async (ciEmpleado, idCaja) => {
  try {
    const cantidadComisionar = await cantidadServiciosComisionar(
      ciEmpleado,
      idCaja
    );
    if (cantidadComisionar.cantidadComisionar === 0) {
      return { codigo: 200, mensaje: 0 };
    } else {
      //Voy a buscar los servicios de las atenciones que son despues de la nro 10
      const serviciosComision = await serviciosComisionar(
        ciEmpleado,
        idCaja,
        cantidadComisionar.cantidadComisionar
      );
      //Voy a buscar todos los precios
      const preciosServicios = await precioServiciosComisionConLimite();
      //Guardo el total a comisionar
      let totalComision = 0;
      //Recorro los servicios a comisionar y sumo el precio al total
      serviciosComision.forEach((servicio) => {
        switch (servicio.idServicio) {
          case 1:
            totalComision += servicio.cantidad * preciosServicios.precioCorte;
            break;
          case 2:
            totalComision +=
              servicio.cantidad * preciosServicios.precioCorteBarba;
            break;
          case 3:
            totalComision +=
              servicio.cantidad * preciosServicios.precioMaquinaBarba;
            break;
          case 4:
            totalComision += servicio.cantidad * preciosServicios.precioBarba;
            break;
          case 5:
            totalComision += servicio.cantidad * preciosServicios.precioMaquina;
            break;
          default:
            break;
        }
      });
      return { codigo: 200, mensaje: totalComision * 0.35 };
    }
  } catch (error) {
    console.log(error);
    return { codigo: 400, mensaje: "Error al calcular comision con limite" };
  }
};

//Metodo auxiliar que me trae los idServicio con la cantidad de cada uno que voy a comisionar
const serviciosComisionar = async (ciEmpleado, idCaja, cantidadTop) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select
    const comisionesConLimite = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .input("ciEmpleado", sql.VarChar, ciEmpleado)
      .input("cantidad", sql.Int, cantidadTop)
      .query(
        "select COUNT(aux.IdEntrada) as cantidad, aux.IdServicio as idServicio from (select top (@cantidad) E.IdEntrada, ES.IdServicio from EntradaDinero E, Caja_Entrada CE, Entrada_Servicio ES where E.IdEntrada = CE.IdEntrada and ES.IdEntrada = E.IdEntrada and ES.IdServicio in (1, 2, 3, 4, 5) and CE.IdCaja = @idCaja and E.Cedula = @ciEmpleado  order by E.Fecha desc) as aux group by aux.IdServicio"
      );
    return comisionesConLimite.recordset;
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para conseguir los precios de los servicios para comision con limite
const precioServiciosComisionConLimite = async () => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select
    const servicios = await pool
      .request()
      .query(
        "select IdServicio as idServicio, Precio as precio from Servicio where IdServicio in (1, 2, 3, 4, 5)"
      );
    //Armo un objeto con el nombre del servicio y el precio
    let retorno = {
      precioCorte: 0,
      precioCorteBarba: 0,
      precioMaquinaBarba: 0,
      precioBarba: 0,
      precioMaquina: 0,
    };
    //Recorro los servicios y le agrego los precios al objeto anterior
    servicios.recordset.forEach((servicio) => {
      switch (servicio.idServicio) {
        case 1:
          retorno.precioCorte = servicio.precio;
          break;
        case 2:
          retorno.precioCorteBarba = servicio.precio;
          break;
        case 3:
          retorno.precioMaquinaBarba = servicio.precio;
          break;
        case 4:
          retorno.precioBarba = servicio.precio;
          break;
        case 5:
          retorno.precioMaquina = servicio.precio;
          break;
        default:
          break;
      }
    });
    return retorno;
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para traer las cantidades correspondientes a comisionar
const cantidadServiciosComisionar = async (ciEmpleado, idCaja) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select
    const cantComisionar = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .input("ciEmpleado", sql.VarChar, ciEmpleado)
      .query(
        "select COUNT(DISTINCT  E.IdEntrada) as cantEntradas from EntradaDinero E, Caja_Entrada CE, Entrada_Servicio ES, Servicio S where E.IdEntrada = CE.IdEntrada and ES.IdEntrada = E.IdEntrada and S.IdServicio = ES.IdServicio and S.IdServicio in (1, 2, 3, 4, 5) and CE.IdCaja = @idCaja and E.Cedula = @ciEmpleado"
      );
    //Reviso cual es lo que me devuelve la consulta anterior
    //Si es 10 o menor devuelvo que la cantidad a comisionar es 0
    if (cantComisionar.recordset[0].cantEntradas < 11) {
      return { codigo: 200, cantidadComisionar: 0 };
    } else {
      //Guardo la cantidad de entradas que deberia poder comisionar
      let cantidad = cantComisionar.recordset[0].cantEntradas - 10;
      return { codigo: 200, cantidadComisionar: cantidad };
    }
  } catch (error) {
    console.log(error);
    return {
      codigo: 400,
      mensaje: "Le erramos a algo calculando la cantidad a comisionar",
    };
  }
};

//Metodo auxiliar para calcular cuanto hay que pagar por horas extra
const calcularPagoHorasExtra = async (ciEmpleado, minExtra) => {
  try {
    const salarioBase = await getSalarioBaseEmpleado(ciEmpleado);
    return ((minExtra * salarioBase) / 480) * 2;
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para conseguir el salario base de un empleado
const getSalarioBaseEmpleado = async (ciEmpleado) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select
    const salarioBase = await pool
      .request()
      .input("ciEmpleado", sql.VarChar, ciEmpleado)
      .query("select SalarioBase from Empleado where Cedula = @ciEmpleado");
    return salarioBase.recordset[0].SalarioBase;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para calcular el jornal de un empleado
const calcularJornal = async (ciEmpleado, minExtra) => {
  try {
    //Voy a buscar la caja
    const caja = await getCaja();
    if (caja.rowsAffected[0] < 1) {
      return { codigo: 400, mensaje: "No hay caja abierta" };
    } else {
      if (caja.recordset[0].total !== 0) {
        return {
          codigo: 400,
          mensaje: "No hay caja abierta, debe abrir la caja",
        };
      } else {
        //Voy a buscar todos los montos por separado
        const comision = await calcularComision(ciEmpleado);
        const propina = await calcularPropina(ciEmpleado);
        const horasExtra = await calcularPagoHorasExtra(ciEmpleado, minExtra);
        const salarioBase = await getSalarioBaseEmpleado(ciEmpleado);
        //Devuelvo la suma de todos estos valores
        return {
          codigo: 200,
          mensaje:
            comision.mensaje + propina.mensaje + horasExtra + salarioBase,
          detalle: {
            comision: comision.mensaje,
            propina: propina.mensaje,
            horasExtra: horasExtra,
            salarioBase: salarioBase,
          },
        };
      }
    }
  } catch (error) {
    console.log(error);
    return {
      codigo: 400,
      mensaje: "Error al calcular jornal del empleado",
    };
  }
};

//Metodo para conseguir una caja por su id
const getCajaIdLimpieza = async (idCaja) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select
    const caja = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .query(
        "select IdCaja as idCaja, DATEADD(day, 1, Fecha) as fecha, Total as total from Caja where IdCaja = @idCaja"
      );
    return caja.recordset[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo para conseguir una caja por su id
const getFechaCaja = async (idCaja) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select
    const caja = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .query("select Fecha as fecha from Caja where IdCaja = @idCaja");
    return caja.recordset[0].fecha;
  } catch (error) {
    console.log(error);
  }
};

//Metodo auxiliar para limpiar las agendas en el mantenimiento
const limpiarAgendas = async (fecha) => {
  try {
    //Llamo a cada metodo individual de eliminar las agendas
    const servicios = await limpiarAgendaServicio(fecha);
    const clientes = await limpiarAgendaCliente(fecha);
    const agendas = await limpiarAgendaNorm(fecha);
    const horarios = await limpiarHorario(fecha);
    //Si llego aca es que se eliminaron todas las agendas sin problemas
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

//Metodo para eliminar los datos de la tabla Agenda_Servicio
const limpiarAgendaServicio = async (fecha) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el delete
    const retorno = await pool
      .request()
      .input("fecha", sql.Date, fecha)
      .query(
        "delete from Agenda_Servicio where IdHorario in (select H.IdHorario as idHorario from Horario H where H.Fecha <= @fecha)"
      );
    return retorno.rowsAffected[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo para eliminar los datos de la tabla Agenda_Cliente
const limpiarAgendaCliente = async (fecha) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el delete
    const retorno = await pool
      .request()
      .input("fecha", sql.Date, fecha)
      .query(
        "delete from Agenda_Cliente where IdHorario in (select H.IdHorario as idHorario from Horario H where H.Fecha <= @fecha)"
      );
    return retorno.rowsAffected[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo para eliminar los datos de la tabla Agenda_Servicio
const limpiarAgendaNorm = async (fecha) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el delete
    const retorno = await pool
      .request()
      .input("fecha", sql.Date, fecha)
      .query(
        "delete from Agenda where IdHorario in (select H.IdHorario as idHorario from Horario H where H.Fecha <= @fecha)"
      );
    return retorno.rowsAffected[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo para eliminar los datos de la tabla Agenda_Servicio
const limpiarHorario = async (fecha) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el delete
    const retorno = await pool
      .request()
      .input("fecha", sql.Date, fecha)
      .query(
        "delete from Horario where IdHorario in (select H.IdHorario as idHorario from Horario H where H.Fecha <= @fecha)"
      );
    return retorno.rowsAffected[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo para el cierre total de la caja
const cierreTotal = async (idCaja, totalEntradas, totalSalidas) => {
  try {
    //Voy a buscar la caja
    const caja = await getCajaIdLimpieza(idCaja);
    //Verifico que la caja no este cerrada ya
    if (caja.total > 0) {
      return { codigo: 400, mensaje: "La caja ya fue cerrada" };
    }
    //Llamo al metodo para limpiar todo
    return await mantenimientoDatos(
      caja.idCaja,
      caja.fecha,
      totalEntradas,
      totalSalidas
    );
  } catch (error) {
    console.log(error);
  }
};

//Metodo para dejar la caja con el total correspondiente
const actualizarMontoCaja = async (idCaja, entradas, salidas) => {
  try {
    //Armo el total a guardar
    let total = 0;
    //Verifico si el total de entradas y salidas es 0
    //En caso de que sean 0 los 2, entonces guardo como total -1
    if (entradas === 0 && salidas === 0) {
      total = -1;
    } else {
      //Guardo el total
      total = entradas + salidas;
    }
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el update
    const retorno = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .input("total", sql.Int, total)
      .query("update Caja set Total = @total where IdCaja = @idCaja");
    if (retorno.rowsAffected[0] > 0) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

//Metodo auxiliar que se llama para hacer la limpieza de todo
//Este metodo llama a los metodos de limpieza individual
//La fecha de la caja es lo que le paso como parametro a todos los metodos de eliminar
const mantenimientoDatos = async (
  idCaja,
  fechaCajaEntradas,
  totalEntradas,
  totalSalidas
) => {
  try {
    //Voy a buscar la fecha de la caja porque necesito la fecha de la caja para eliminar las agendas y la fecha + 1 para eliminar las entradas
    const fechaCaja = await getFechaCaja(idCaja);
    //Llamo a limpiar todas las agendas
    const agendas = await limpiarAgendas(fechaCaja);
    if (!agendas) {
      return { codigo: 400, mensaje: "Error al eliminar las agendas" };
    }
    //Llamo para actualizar la caja y ponerle el total correspondiente
    const caja = await actualizarMontoCaja(idCaja, totalEntradas, totalSalidas);
    if (!caja) {
      return {
        codigo: 400,
        mensaje: "Error al actualizar el total de la caja",
      };
    }
    //Llamo para limpiar todas las entradas de dinero
    const limpiezaCaja = limpiarCaja(fechaCajaEntradas);
    if (!limpiezaCaja) {
      return { codigo: 400, mensaje: "Error al limpiar la caja" };
    }
    //Si llegamos aca sin algun mensaje devuelvo que se limpio todo
    return { codigo: 200, mensaje: "Mantenimiento realizado correctamente" };
  } catch (error) {
    console.log(error);
  }
};

//Metodo para limpiar la caja entera
const limpiarCaja = async (fechaCaja) => {
  try {
    //De aca llamo a todos los metodos de eliminar caja individuales
    const cajaSalida = await limpiarCajaSalida(fechaCaja);
    const cajaEntrada = await limpiarCajaEntrada(fechaCaja);
    const entradaDebito = await limpiarEntradaDebito(fechaCaja);
    const entradaEfectivo = await limpiarEntradaEfectivo(fechaCaja);
    const entradaProducto = await limpiarEntradaProducto(fechaCaja);
    const EntradaServicio = await limpiarEntradaServicio(fechaCaja);
    const entrada = await limpiarEntrada(fechaCaja);
    const salida = await limpiarSalida(fechaCaja);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

//Metodo para eliminar los datos de la tabla Agenda_Servicio
const limpiarCajaSalida = async (fecha) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el delete
    const retorno = await pool
      .request()
      .input("fecha", sql.Date, fecha)
      .query(
        "delete from Caja_Salida where IdSalida in (select IdSalida from SalidaDinero where Fecha <= @fecha)"
      );
    return retorno.rowsAffected[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo para eliminar los datos de la tabla Agenda_Servicio
const limpiarCajaEntrada = async (fecha) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el delete
    const retorno = await pool
      .request()
      .input("fecha", sql.Date, fecha)
      .query(
        "delete from Caja_Entrada where IdEntrada in (select IdEntrada from EntradaDinero where Fecha <= @fecha)"
      );
    return retorno.rowsAffected[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo para eliminar los datos de la tabla Agenda_Servicio
const limpiarEntradaDebito = async (fecha) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el delete
    const retorno = await pool
      .request()
      .input("fecha", sql.Date, fecha)
      .query(
        "delete from Entrada_Debito where IdEntrada in (select IdEntrada from EntradaDinero where Fecha <= @fecha)"
      );
    return retorno.rowsAffected[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo para eliminar los datos de la tabla Agenda_Servicio
const limpiarEntradaEfectivo = async (fecha) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el delete
    const retorno = await pool
      .request()
      .input("fecha", sql.Date, fecha)
      .query(
        "delete from Entrada_Efectivo where IdEntrada in (select IdEntrada from EntradaDinero where Fecha <= @fecha)"
      );
    return retorno.rowsAffected[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo para eliminar los datos de la tabla Agenda_Servicio
const limpiarEntradaProducto = async (fecha) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el delete
    const retorno = await pool
      .request()
      .input("fecha", sql.Date, fecha)
      .query(
        "delete from Entrada_Producto where IdEntrada in (select IdEntrada from EntradaDinero where Fecha <= @fecha)"
      );
    return retorno.rowsAffected[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo para eliminar los datos de la tabla Agenda_Servicio
const limpiarEntradaServicio = async (fecha) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el delete
    const retorno = await pool
      .request()
      .input("fecha", sql.Date, fecha)
      .query(
        "delete from Entrada_Servicio where IdEntrada in (select IdEntrada from EntradaDinero where Fecha <= @fecha)"
      );
    return retorno.rowsAffected[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo para eliminar los datos de la tabla Agenda_Servicio
const limpiarSalida = async (fecha) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el delete
    const retorno = await pool
      .request()
      .input("fecha", sql.Date, fecha)
      .query(
        "delete from SalidaDinero where IdSalida in (select IdSalida from SalidaDinero where Fecha <= @fecha)"
      );
    return retorno.rowsAffected[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo para eliminar los datos de la tabla Agenda_Servicio
const limpiarEntrada = async (fecha) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el delete
    const retorno = await pool
      .request()
      .input("fecha", sql.Date, fecha)
      .query(
        "delete from EntradaDinero where IdEntrada in (select IdEntrada from EntradaDinero where Fecha <= @fecha)"
      );
    return retorno.rowsAffected[0];
  } catch (error) {
    console.log(error);
  }
};

//Metodo para conseguir el total de salidas de dinero de cada empleado
const getSalidasDineroEmpleados = async (idCaja) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el select
    const retorno = await pool
      .request()
      .input("idCaja", sql.Int, idCaja)
      .query(
        "select E.Nombre as nombre, S.Cedula as cedula, SUM(S.Monto) as totalSalidas from SalidaDinero S, Empleado E, Caja_Salida CS where S.Cedula = E.Cedula and CS.IdSalida = S.IdSalida and CS.IdCaja = @idCaja group by S.Cedula, E.Nombre"
      );
    //Sumo todos los valores y armo un total
    let totalSalida = 0;
    retorno.recordset.forEach((salida) => {
      totalSalida += salida.totalSalidas;
    });
    return [...retorno.recordset, { total: totalSalida }];
  } catch (error) {
    console.log(error);
  }
};

//Metodo para modificar el rol de un empleado
const modificarRolEmpleado = async (ciEmpleado, rol) => {
  try {
    //Creo la conexion
    let pool = await sql.connect(conexion);
    //Hago el delete
    const retorno = await pool
      .request()
      .input("ciEmpleado", sql.VarChar, ciEmpleado)
      .input("rol", sql.Int, rol)
      .query("update Empleado_Rol set IdRol = @rol where Cedula = @ciEmpleado");
    if (retorno.rowsAffected < 1) {
      return { codigo: 400, mensaje: "Error al modificar el rol del empleado" };
    } else {
      return { codigo: 200, mensaje: "Rol modificado correctamente" };
    }
  } catch (error) {
    console.log(error);
  }
};

//Creo un objeto que voy a exportar para usarlo desde el index.js
//Adentro voy a tener todos los metodos de llamar a la base
const interfaz = {
  getDatosFormulario,
  aceptarAgenda,
  getDatosListadoAgendas,
  datosListadoPreagendas,
  getAgendaPorId,
  verificarManejoAgenda,
  getAgendasAceptadas,
  datosFormularioCaja,
  modificarAgenda,
  cancelarAgenda,
  registrarCliente,
  login,
  abrirCaja,
  nuevaEntradaDinero,
  crearCuponera,
  modificarSaldoCuponera,
  updateCuponera,
  getSaldoCuponera,
  getIdCajaHoy,
  nuevaSalidaDinero,
  getDatosFormularioModificarAgenda,
  updateManejarAgenda,
  verificarHorario,
  verificacionEntradaCaja,
  updateProducto,
  cierreCaja,
  realizarEntradaDinero,
  getListadoProductos,
  crearNuevoProducto,
  juntarAgendasServicioCliente,
  updateHabilitarEmpleado,
  listadoEmpleadosHabilitacion,
  reestablecerContra,
  discontinuarProducto,
  calcularComision,
  calcularPropina,
  calcularJornal,
  nuevaContra,
  cierreTotal,
  modificarRolEmpleado,
  cajaParaCalculos,
  datosListadoAgendas
};

//Exporto el objeto interfaz para que el index lo pueda usar
module.exports = interfaz;
