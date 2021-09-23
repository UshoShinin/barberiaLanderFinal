const path = require("path");
const express = require("express");
const router = express.Router();
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

//Importo la interfaz. Esto va a tener los metodos para llamar a la base
const interfaz = require("./interfaz");

// Have Node serve the files for our built React app
/* app.use(express.static(path.resolve(__dirname, './cliente/barberiaLander/build'))); */

app.use("/datosFormularioAgenda", (req, res) => {
  let ret = interfaz.getDatosFormulario();
  ret.then((empleados) => {
    res.json({
      mensaje: empleados,
    });
  });
});

app.use("/aceptarAgenda", (req, res) => {
  let id = req.body.idAgenda;
  let horario = {
    ciEmpleado: req.body.ciEmpleado,
    horario: req.body.horario,
    fecha: req.body.fecha,
  };
  let ret = interfaz.aceptarAgenda(id, horario);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/listadoAgendas", (req, res) => {
  let ret = interfaz.getDatosListadoAgendas();
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/listadoPreAgendas", (req, res) => {
  let ret = interfaz.datosListadoPreagendas();
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/listadoAgendasAceptadas", (req, res) => {
  let ret = interfaz.datosListadoAgendas();
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/agendaPorId", (req, res) => {
  //Traer también el nombre del empleado
  let id = req.query.idAgenda;
  let ret = interfaz.getAgendaPorId(id);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/crearAgenda", (req, res) => {
  const ret = interfaz.verificarManejoAgenda(req.body);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/datosFormularioCaja", (req, res) => {
  const ret = interfaz.datosFormularioCaja();
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/modificarAgenda", (req, res) => {
  const ret = interfaz.modificarAgenda(req.body);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.delete("/eliminarAgenda", (req, res) => {
  let idAgenda = req.body.idAgenda;
  let idHorario = req.body.idHorario;
  const ret = interfaz.cancelarAgenda(idAgenda, idHorario);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/verificarEntrada", (req, res) => {
  const ret = interfaz.verificacionEntradaCaja(
    req.body.idAgenda,
    req.body.listadoProductos,
    req.body.ciCliente,
    req.body.monto
  );
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/entradaCaja", (req, res) => {
  const ret = interfaz.nuevaEntradaDinero(
    req.body.idCaja,
    req.body.montoTotal,
    req.body.pago,
    req.body.ciEmpleado,
    req.body.productosVendidos,
    req.body.servicios,
    req.body.descripcion,
    req.body.idAgenda,
    req.body.idHorario
  );
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/cobrarCaja", (req, res) => {
  const ret = interfaz.realizarEntradaDinero(
    req.body.idCaja,
    req.body.montoTotal,
    req.body.pago,
    req.body.ciEmpleado,
    req.body.productosVendidos,
    req.body.servicios,
    req.body.descripcion,
    req.body.idAgenda,
    req.body.idHorario
  );
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/salidaCaja", (req, res) => {
  const ret = interfaz.nuevaSalidaDinero(
    req.body.idCaja,
    req.body.descripcion,
    req.body.monto,
    req.body.fecha,
    req.body.cedula
  );
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/registroCliente", (req, res) => {
  const ret = interfaz.registrarCliente(req.body);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/login", (req, res) => {
  let ret = interfaz.login(req.body);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/abrirCaja", (req, res) => {
  let ret = interfaz.abrirCaja(req.body);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/modificarSaldoCuponera", (req, res) => {
  const ret = interfaz.modificarSaldoCuponera(req.body.cedula, req.body.monto);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/updateCuponera", (req, res) => {
  const ret = interfaz.updateCuponera(
    req.body.ciActual,
    req.body.ciNueva,
    req.body.monto
  );
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/crearCuponera", (req, res) => {
  const ret = interfaz.crearCuponera(
    req.body.cedula,
    req.body.monto,
    req.body.caja
  );
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/getSaldoCuponera", (req, res) => {
  let cedula = req.query.cedula;
  const ret = interfaz.getSaldoCuponera(cedula);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/getIdCajaHoy", (req, res) => {
  const ret = interfaz.getIdCajaHoy();
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/getDatosFormularioModificarAgenda", (req, res) => {
  let id = req.query.idAgenda;
  let ret = interfaz.getDatosFormularioModificarAgenda(id);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/manejoDeAgendas", (req, res) => {
  let valor = req.query.aceptarRechazar;
  let ret = interfaz.updateManejarAgenda(valor);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/cierreCaja", (req, res) => {
  let valor = req.query.idCaja;
  let ret = interfaz.cierreCaja(valor);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/modificarProducto", (req, res) => {
  const ret = interfaz.updateProducto(
    req.body.idProducto,
    req.body.nombre,
    req.body.stock,
    req.body.precio,
    req.body.descontinuado
  );
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/listadoProductos", (req, res) => {
  let ret = interfaz.getListadoProductos();
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/crearProducto", (req, res) => {
  const ret = interfaz.crearNuevoProducto(
    req.body.nombre,
    req.body.precio,
    req.body.stock,
    req.body.descontinuado
  );
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/getAgendasCliente", (req, res) => {
  let valor = req.query.cedula;
  let ret = interfaz.juntarAgendasServicioCliente(valor);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/listadoHabilitarEmpleados", (req, res) => {
  let ret = interfaz.listadoEmpleadosHabilitacion();
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/habilitarEmpleado", (req, res) => {
  const ret = interfaz.updateHabilitarEmpleado(
    req.body.ciEmpleado,
    req.body.habilitado
  );
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
});
});

app.put("/discontinuarProducto", (req, res) => {
  const ret = interfaz.discontinuarProducto(
    req.body.idProducto,
    req.body.discontinuar
  );
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/comision", (req, res) => {
  let ret = interfaz.calcularComision(req.body.ciEmpleado);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/propina", (req, res) => {
  let ret = interfaz.calcularPropina(req.body.ciEmpleado);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/jornal", (req, res) => {
  let ret = interfaz.calcularJornal(
    req.body.ciEmpleado,
    req.body.minExtra
  );
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/reestablecerContra", (req, res) => {
  const ret = interfaz.reestablecerContra(
    req.body.cedula,
    req.body.contra,
    req.body.identificador
  );
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/nuevaContra", (req, res) => {
  const ret = interfaz.nuevaContra(
    req.body.cedula,
    req.body.contra,
    req.body.identificador
  );
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.delete("/cierreTotal", (req, res) => {
  const ret = interfaz.cierreTotal(
    req.body.idCaja,
    req.body.totalEntradas,
    req.body.totalSalidas
  );
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.put("/modificarRolEmpleado", (req, res) => {
  const ret = interfaz.modificarRolEmpleado(
    req.body.ciEmpleado,
    req.body.rol //Esto espero que me llegue 1, 2 o 3 que son Administrador, Empleado, Encargado respectivamente
  );
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/cajaParaCalculos", (req, res) => {
  let ret = interfaz.cajaParaCalculos();
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

// All other GET requests not handled before will return our React app
/* app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './cliente/barberiaLander/build', 'index.html'));
}); */

//No escribir nada por debajo de esto
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
