import FormularioAgenda from "./FormularioAgenda/FormularioAgenda";
import { useHistory } from "react-router-dom";
import NormalCard from "../../components/UI/Card/NormalCard";
import useHttp from "../../hooks/useHttp";
import classes from "./CrearAgenda.module.css";
import { useEffect, useContext, useReducer } from "react";
import LoaddingSpinner from "../../components/LoaddingSpinner/LoaddingSpinner";
import AuthContext from "../../store/AuthContext";
import { getElementById } from "../../FuncionesAuxiliares/FuncionesAuxiliares";
import Modal from "../../components/UI/Modal/Modal";
import Marco from "../../components/UI/Marco/Marco";
import Note from "../../components/UI/Note/Note";
import {
  horariosAgendarDisponibles,
  obtenerHorariosDeDia,
  getIdByTitle,
  cargarHorariosEnMinutos,
  calcularTiempo,
  transformNumberString,
} from "../../components/Calendario/FuncionesAuxiliares";
import { getDayIndex2 } from "../../components/Calendario/Dias/FunctionsDias";
import { inputReducer } from "./FormularioAgenda/ReduerFormularioAgenda";
import Pablo from '../../recursos/ImagenesPrueba/Pab.jpg'
import Ignacio from '../../recursos/ImagenesPrueba/Ign.jpg'
import Ezequiel from '../../recursos/ImagenesPrueba/Eze.jpg'
import Larry from '../../recursos/ImagenesPrueba/Larry.jpg'
const CrearAgenda = (props) => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const width = document.getElementById("root").clientWidth;
  let initialState = {
    Mensaje: { show: false, text: "" },
    manejoAgenda: 0,
    Nombre: { value: "", isValid: null },
    Horarios: null,
    HorariosFiltrados: null,
    Telefono: { value: "", isValid: null },
    Descripcion: { value: "", isValid: null },
    Referencia: { value: null },
    Calendario: { value: null, dia: null },
    ComboBox: { value: null, active: false, title: "" },
    Employee: {
      value: props.agenda !== null ? props.agenda.ciPeluquero : null,
      active: false,
    },
    servicios: {
      corte: { active: false, id: 1 },
      barba: { active: false, id: 4 },
      maquina: { active: false, id: 5 },
      claritos: { active: false, id: 6 },
      decoloracion: { active: false, id: 7 },
      brushing: { active: false, id: 8 },
    },
    ciCliente: -1,
    problema: -1,
    problemas: [
      { id: 1, pro: "" },
      { id: 2, pro: "" },
    ],
  };
  const [inputState, dispatchInput] = useReducer(inputReducer, initialState);

  const armadoDeDatos = (horarios, empleados, manejoAgenda) => {
    let misEmpleados = [];
    let miManejoAgenda =
      manejoAgenda !== undefined ? manejoAgenda.AceptarRechazar : 0;
    let nombre;
    let telefono;
    let ciCliente = -1;
    let servicios = { ...misServicios };
    let Calendario = { value: null, dia: null };
    let descripcion = { value: "", isValid: null };
    let comboBox = { value: null, active: false, title: "" };
    let id = 1;
    let misFotos = [
      {id:'48279578',foto:Ignacio},
      {id:'50098037',foto:Ezequiel},
      {id:'52991283',foto:Pablo},
      {id:'62812502',foto:Larry}
    ]
    empleados.forEach(e => {
      misEmpleados.push({...e,foto:getElementById(misFotos,e.id).foto})
    });
    console.log(misEmpleados);
    if (agenda !== null) {
      let empleado = getElementById(
        horarios.mensaje.empleados,
        agenda.ciPeluquero
      );
      const d = agenda.fecha.d;
      const m = agenda.fecha.m;
      const date = new Date();
      const realMonth = date.getMonth() + 1;
      const realYear = date.getFullYear();
      const y = m < realMonth ? realYear + 1 : realYear;
      const diaSemana = getDayIndex2(d, m, y);
      const jornada = getElementById(empleado.jornada, diaSemana);
      let tiempo;
      nombre = { value: agenda.nombreCliente, isValid: true };
      telefono = { value: agenda.tel, isValid: true };
      descripcion = { value: agenda.descripcion, isValid: null };
      servicios = {
        corte: { active: agenda.servicios.corte, id: 1 },
        barba: { active: agenda.servicios.barba, id: 4 },
        maquina: { active: agenda.servicios.maquina, id: 5 },
        claritos: { active: agenda.servicios.claritos, id: 6 },
        decoloracion: { active: agenda.servicios.decoloracion, id: 7 },
        brushing: { active: agenda.servicios.brushing, id: 8 },
      };
      horarios = obtenerHorariosDeDia(
        agenda.fecha.d,
        agenda.fecha.m,
        empleado.fechas
      );
      tiempo = calcularTiempo(empleado, servicios);
      const resultado =
        horarios !== null
          ? horariosAgendarDisponibles(
              horarios,
              tiempo,
              jornada.entrada,
              jornada.salida
            ).map((h) => {
              id++;
              return { id: id, title: transformNumberString(h) };
            })
          : cargarHorariosEnMinutos(agenda.fecha, empleado,tiempo);
      const position = getIdByTitle(resultado, agenda.horario.i);
      Calendario = {
        value: resultado,
        dia: { ...agenda.fecha },
      };
      comboBox = { value: position, active: false, title: agenda.horario.i };
    } else {
      nombre = { value: "", isValid: null };
      telefono = { value: "", isValid: null };
      if (authCtx.isLoggedIn && authCtx.user.rol === "Cliente") {
        nombre = { value: authCtx.user.nombre, isValid: true };
        telefono = { value: authCtx.user.telefono, isValid: true };
        ciCliente = authCtx.user.ciUsuario;
      }
    }
    const empoooo = {
      value:
        initialState.Employee.value === null
          ? empleados[0].id
          : initialState.Employee.value,
    };

    const datitos = {
      manejoAgenda: miManejoAgenda,
      Nombre: { ...nombre },
      Telefono: { ...telefono },
      Descripcion: { ...descripcion },
      Horarios: [...misEmpleados],
      HorariosFiltrados: [...misEmpleados],
      Employee: { ...empoooo },
      servicios: { ...servicios },
      Calendario: { ...Calendario },
      ComboBox: { ...comboBox },
      ciCliente: ciCliente,
    };
    return datitos;
  };

  const getRespuestaReservar = (res) => {
    console.log(res);
    let datos = res.mensaje.datos;
    datos = datos !== undefined ? datos : null;
    const empleados = datos !== null ? datos.empleados : null;
    let misDatos = {};
    let Calendario = { value: null, dia: null };
    let comboBox = { value: null, active: false, title: "" };
    if (datos !== null) {
      if (res.mensaje.codigo === 400) {
        misDatos = {
          Horarios: [...empleados],
          HorariosFiltrados: [...empleados],
          Calendario: { ...Calendario },
          comboBox: { ...comboBox },
        };
      } else {
        misDatos = { ...armadoDeDatos(datos, empleados) };
      }
    }
    dispatchInput({
      type: "RESET",
      payload: misDatos,
      value: res.mensaje.mensaje,
    });
  };

  const getRespuestaModificar = (res) => {
    if (res.mensaje.codigo === 400) {
      const misDatos = {};
      dispatchInput({
        type: "RESET",
        payload: misDatos,
        value: res.mensaje.mensaje,
      });
    } else {
      props.exitModificar();
    }
  };

  const mandarAgenda = useHttp();
  const mandarAgendaModificar = useHttp();

  const guardarDatosAgendaHandler = (enteredDatosAgenda) => {
    mandarAgenda(
      {
        url: "/crearAgenda",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: enteredDatosAgenda,
      },
      getRespuestaReservar
    );
  };
  const modificarDatosAgendaHandler = (enteredDatosAgenda) => {
    mandarAgendaModificar(
      {
        url: "/modificarAgenda",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: enteredDatosAgenda,
      },
      getRespuestaModificar
    );
  };

  /* Carga inicial de datos */
  const misServicios = initialState.servicios;
  const agenda = props.agenda;
  const obtenerHorarios = (horarios) => {
    console.log(horarios.mensaje.empleados);
    let manejoAgenda = horarios.mensaje.manejoAgenda;
    if (
      agenda === null &&
      manejoAgenda !== undefined &&
      manejoAgenda.AceptarRechazar === -1
    ) {
      dispatchInput({ type: "MANEJO_AGENDAS", value: -1 });
    } else {
      dispatchInput({
        type: "CARGAR_DATOS",
        payload: armadoDeDatos(
          horarios,
          horarios.mensaje.empleados,
          manejoAgenda
        ),
      });
    }
  };
  const fetchHorarios = useHttp();

  /* Se ejecuta al inicio para que se cargen los datos */
  useEffect(() => {
    if (agenda !== null) {
      fetchHorarios(
        {
          url: "/getDatosFormularioModificarAgenda?idAgenda=" + agenda.idagenda,
        },
        obtenerHorarios
      );
    } else {
      fetchHorarios({ url: "/datosFormularioAgenda" }, obtenerHorarios);
    }
  }, []);
  return (
  <>
    {inputState.Horarios === null&&<Marco use={true} logo={true}>
       <LoaddingSpinner />
    </Marco>}
    <Marco use={width > 900} className={classes.nuevaAgenda}>
      <Note
        show={inputState.Mensaje.show}
        onClose={() => {
          dispatchInput({ type: "HIDE_MENSAJE" });
        }}
      >
        {inputState.Mensaje.text}
      </Note>
      <Modal
        closed={() => {
          history.replace("/");
        }}
        show={inputState.manejoAgenda === -1}
      >
        <h1 className={classes.mensajeTitulo}>
          No se aceptan reservas por el momento
        </h1>
      </Modal>
      {inputState.manejoAgenda !== -1 && (
        <NormalCard>
          {inputState.Horarios !== null && (
            <FormularioAgenda
              onSaveDatosAgenda={guardarDatosAgendaHandler}
              onUpdateDatosAgenda={modificarDatosAgendaHandler}
              agenda={
                props.agenda !== null
                  ? {
                      idagenda: props.agenda.idagenda,
                      idHorario: props.agenda.idHorario,
                    }
                  : null
              }
              inputState={inputState}
              dispatchInput={dispatchInput}
            />
          )}
        </NormalCard>
      )}
    </Marco>
    </>
  );
};

export default CrearAgenda;
