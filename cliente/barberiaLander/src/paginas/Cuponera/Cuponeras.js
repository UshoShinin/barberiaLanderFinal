import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Cuponeras.module.css";
import Marco from "../../components/UI/Marco/Marco";
import Border from "../../components/UI/Border/Border";
import { useEffect, useReducer, useRef, useContext } from "react";
import { initialState, reducer } from "./Reducer";
import inputs from "./inputs";
import useHttp from "../../hooks/useHttp";
import AuthContext from "../../store/AuthContext";
import { useHistory } from "react-router-dom";
import Note from "../../components/UI/Note/Note";
const Cuponeras = () => {
  const width = document.getElementById("root").clientWidth;
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const [cuponeraState, dispatchCuponera] = useReducer(reducer, initialState);
  const INPUTS = inputs(cuponeraState, dispatchCuponera);
  const refCrearCi = useRef();
  const refCrearMonto = useRef();
  const refAgregarCi = useRef();
  const refAgregarMonto = useRef();
  const refModificarCiA = useRef();
  const refModificarCiN = useRef();
  const refModificarMonto = useRef();
  const refConsultar = useRef();
  const CrearP = cuponeraState.Crear.problema;
  const AgregarP = cuponeraState.Agregar.problema;
  const ModificarP = cuponeraState.Modificar.problema;
  const ConsultarP = cuponeraState.Consultar.problema;

  const sendCrear = useHttp();

  const sendAgregar = useHttp();

  const sendModificar = useHttp();

  const sendConsultar = useHttp();

  const sendFormulario = useHttp();

  const entradaDinero = useHttp();

  const getRespuestaCrear = (res) => {
    if (res.mensaje.codigo === 400) {
      dispatchCuponera({ type: "CREAR_PROBLEMA", value: res.mensaje.mensaje });
    } else {
      dispatchCuponera({
        type: "SHOW_MENSAJE",
        value: "Cuponera creada correctamente",
        reset: "CREAR",
      });
    }
  };
  const getRespuestaCaja = (res) => {
    if (res.mensaje.codigo === 400) {
      dispatchCuponera({
        type: "AGREGAR_PROBLEMA",
        value: res.mensaje.mensaje,
      });
    } else {
      dispatchCuponera({
        type: "SHOW_MENSAJE",
        value: "Saldo agregado satisfactoriamente",
        reset: "AGREGAR",
      });
    }
  };
  const getRespuestaAgregar = (res) => {
    if (res.mensaje.codigo === 400) {
      dispatchCuponera({
        type: "AGREGAR_PROBLEMA",
        value: res.mensaje.mensaje,
      });
    } else {
      let monto = parseInt(cuponeraState.Agregar.monto.value, 10);
      const caja = {
        idCaja: cuponeraState.idCaja,
        fecha: new Date(),
        ciEmpleado: authCtx.user.ciUsuario,
        montoTotal: monto,
        pago: {
          numeroTicket: "",
          Efectivo: monto,
          Debito: 0,
          Cuponera: 0,
        },
        productosVendidos: null,
        servicios: null,
        descripcion: "X",
      };
      entradaDinero(
        {
          url: "/entradaCaja",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: caja,
        },
        getRespuestaCaja
      );
    }
  };
  const getRespuestaModificar = (res) => {
    if (res.mensaje.codigo === 400) {
      dispatchCuponera({
        type: "MODIFICAR_PROBLEMA",
        value: res.mensaje.mensaje,
      });
    } else {
      dispatchCuponera({
        type: "SHOW_MENSAJE",
        value: res.mensaje.mensaje,
        reset: "MODIFICAR",
      });
    }
  };

  const getRespuestaConsultar = (res) => {
    if (res.mensaje.codigo === 400) {
      dispatchCuponera({
        type: "CONSULTAR_PROBLEMA",
        value: res.mensaje.mensaje,
      });
    } else {
      dispatchCuponera({
        type: "SHOW_MENSAJE",
        value: "Saldo: $" + res.mensaje.mensaje,
        reset: "CONSULTAR",
      });
    }
  };

  const obtenerDatos = (res) => {
    if (res.mensaje !== -1)
      dispatchCuponera({ type: "CARGAR_DATOS", value: res.mensaje });
  };

  const VC = authCtx.user === null || authCtx.user.rol === "Cliente";
  useEffect(() => {
    sendFormulario({ url: "/getIdCajaHoy" }, obtenerDatos);
  }, [sendFormulario]);
  const crearHandler = () => {
    const Crear = cuponeraState.Crear;
    if (!Crear.cedula.isValid) refCrearCi.current.focus();
    else if (Crear.monto.isValid === false) refCrearMonto.current.focus();
    else {
      let montoFinal = null;
      let monto =
        cuponeraState.Crear.monto.isValid !== null
          ? parseInt(Crear.monto.value, 10)
          : null;
      monto = monto === 0 ? null : monto;
      if (monto !== null) montoFinal = Math.round(monto * 1.1);
      const data = {
        cedula: Crear.cedula.value,
        monto: montoFinal,
        caja: {
          idCaja: cuponeraState.idCaja,
          fecha: new Date(),
          ciEmpleado: authCtx.user.ciUsuario,
          montoTotal: monto,
          pago: {
            numeroTicket: "",
            Efectivo: monto,
            Debito: 0,
            Cuponera: 0,
          },
          productosVendidos: null,
          servicios: null,
          descripcion: "C",
        },
      };
      sendCrear(
        {
          url: "/crearCuponera",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
        },
        getRespuestaCrear
      );
    }
  };
  const agregarHandler = () => {
    const Agregar = cuponeraState.Agregar;
    if (!Agregar.cedula.isValid) refAgregarCi.current.focus();
    else if (!Agregar.monto.isValid) refAgregarMonto.current.focus();
    else {
      const data = {
        cedula: Agregar.cedula.value,
        monto: Math.round(parseInt(Agregar.monto.value, 10) * 1.1),
      };
      sendAgregar(
        {
          url: "/modificarSaldoCuponera",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
        },
        getRespuestaAgregar
      );
    }
  };

  const modificarHandler = () => {
    const Modificar = cuponeraState.Modificar;
    if (!Modificar.cedulaAnterior.isValid) refModificarCiA.current.focus();
    else if (Modificar.cedulaNueva.isValid === false)
      refModificarCiN.current.focus();
    else if (Modificar.monto.isValid === false)
      refModificarMonto.current.focus();
    else if (
      Modificar.cedulaNueva.isValid === null &&
      Modificar.monto.isValid === null
    ) {
      dispatchCuponera({
        type: "MODIFICAR_PROBLEMA",
        value: "Debe modificar el cliente o el monto",
      });
    } else if (
      Modificar.cedulaNueva.isValid !== null &&
      Modificar.cedulaAnterior.value === Modificar.cedulaNueva.value
    ) {
      dispatchCuponera({
        type: "MODIFICAR_PROBLEMA",
        value: "La cedula nueva y la anterior no pueden coincidir",
      });
    } else {
      const miMonto = parseInt(Modificar.monto.value, 10);
      const data = {
        ciActual:
          Modificar.cedulaAnterior.isValid === true
            ? Modificar.cedulaAnterior.value
            : null,
        ciNueva:
          Modificar.cedulaNueva.isValid === true
            ? Modificar.cedulaNueva.value
            : null,
        monto: isNaN(miMonto) ? null : miMonto,
      };
      console.log(data);
      sendModificar(
        {
          url: "/updateCuponera",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
        },
        getRespuestaModificar
      );
    }
  };

  const consultarHandler = () => {
    const Consultar = cuponeraState.Consultar;
    if (!Consultar.cedula.isValid) refConsultar.current.focus();
    else {
      const url = "/getSaldoCuponera?cedula=" + Consultar.cedula.value;
      sendConsultar({ url }, getRespuestaConsultar);
    }
  };

  return (
    <Marco use={width > 900 || VC} className={`${!VC?classes.container:''} ${VC?classes.ajuste:''}`}>
      <Note
        show={cuponeraState.Mensaje.show}
        onClose={() => {
          dispatchCuponera({ type: "HIDE_MENSAJE" });
        }}
      >
        {cuponeraState.Mensaje.text}
      </Note>
      {!VC && (
        <Border disabled={!cuponeraState.active}>
          <h1
            className={`${
              cuponeraState.active ? classes.text : classes.textDisabled
            }`}
          >
            Crear Cuponera
          </h1>
          <div>
            <label
              className={`${
                cuponeraState.active ? classes.textL : classes.textLDisabled
              }`}
            >
              Cédula Cliente
            </label>
            <Input
              ref={refCrearCi}
              isValid={cuponeraState.Crear.cedula.isValid}
              input={INPUTS[0]}
            />
            <label
              className={`${
                cuponeraState.active ? classes.textL : classes.textLDisabled
              }`}
            >
              Monto inicial
            </label>
            <Input
              ref={refCrearMonto}
              isValid={cuponeraState.Crear.monto.isValid}
              input={INPUTS[1]}
            />
          </div>
          <p className={classes.textP}>
            {CrearP !== -1 ? cuponeraState.Crear.problemas[CrearP].pro : ""}
          </p>
          <Button disabled={!cuponeraState.active} action={crearHandler}>
            Crear
          </Button>
        </Border>
      )}
      {!VC && (
        <Border disabled={!cuponeraState.active}>
          <h1
            className={`${
              cuponeraState.active ? classes.text : classes.textDisabled
            }`}
          >
            Agregar Saldo
          </h1>
          <div>
            <label
              className={`${
                cuponeraState.active ? classes.textL : classes.textLDisabled
              }`}
            >
              Cédula Cliente
            </label>
            <Input
              ref={refAgregarCi}
              isValid={cuponeraState.Agregar.cedula.isValid}
              input={INPUTS[2]}
            />
            <label
              className={`${
                cuponeraState.active ? classes.textL : classes.textLDisabled
              }`}
            >
              Dinero ingresado
            </label>
            <Input
              ref={refAgregarMonto}
              isValid={cuponeraState.Agregar.monto.isValid}
              input={INPUTS[3]}
            />
          </div>
          <p className={classes.textP}>
            {AgregarP !== -1
              ? cuponeraState.Agregar.problemas[AgregarP].pro
              : ""}
          </p>
          <Button disabled={!cuponeraState.active} action={agregarHandler}>
            Agregar
          </Button>
        </Border>
      )}
      {!VC && (
        <Border disabled={!cuponeraState.active}>
          <h1 className={classes.text}>Modificar Cuponera</h1>
          <div>
            <label className={classes.textL}>Cédula Cliente Actual</label>
            <Input
              ref={refModificarCiA}
              isValid={cuponeraState.Modificar.cedulaAnterior.isValid}
              input={INPUTS[4]}
            />
            <label className={classes.textL}>Cédula Nuevo Cliente</label>
            <Input
              ref={refModificarCiN}
              isValid={cuponeraState.Modificar.cedulaNueva.isValid}
              input={INPUTS[5]}
            />
            <label className={classes.textL}>Nuevo Monto</label>
            <Input
              ref={refModificarMonto}
              isValid={cuponeraState.Modificar.monto.isValid}
              input={INPUTS[6]}
            />
          </div>
          <p className={classes.textP}>
            {ModificarP !== -1
              ? cuponeraState.Modificar.problemas[ModificarP].pro
              : ""}
          </p>
          <Button action={modificarHandler}>Modificar</Button>
        </Border>
      )}
        <Border disabled={!cuponeraState.active}>
          <h1 className={classes.text}>Consultar Cuponera</h1>
          <div>
            <label className={classes.textL}>Cédula Cliente</label>
            <Input
              ref={refConsultar}
              isValid={cuponeraState.Consultar.cedula.isValid}
              input={INPUTS[7]}
            />
          </div>
          <p className={classes.textP}>
            {ConsultarP !== -1
              ? cuponeraState.Consultar.problemas[ConsultarP].pro
              : ""}
          </p>
          <Button action={consultarHandler}>Consultar</Button>
        </Border>
    </Marco>
  );
};

export default Cuponeras;
