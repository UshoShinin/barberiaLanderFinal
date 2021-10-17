import classes from "./FormularioAgenda.module.css";
import React, {
  useRef,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import TextArea from "../../../components/UI/TextArea/TextArea";
import Calendario from "../../../components/Calendario/Calendario";
import { calcularTiempo } from "../../../components/Calendario/FuncionesAuxiliares";
import { cargarHorariosEnMinutos } from "../../../components/Calendario/FuncionesAuxiliares";
import CheckBoxAgenda from "./CheckBoxAgenda";
import useDayGenerator from "../../../hooks/useDayGenerator";
import { getElementById } from "../../../FuncionesAuxiliares/FuncionesAuxiliares";
import { getDayIndex2 } from "../../../components/Calendario/Dias/FunctionsDias";
import ComboBox from "../../../components/ComboBox/ComboBox";

import {
  transformNumberString,
  minutosAHorarios,
  transformStringNumber,
  horarioEnMinutos,
} from "../../../components/Calendario/FuncionesAuxiliares";
import AuthContext from "../../../store/AuthContext";
const FormularioAgenda = (props) => {
  const inputState = props.inputState;
  const dispatchInput = props.dispatchInput;
  const nombreRef = useRef();
  const telefonoRef = useRef();
  const descripcionRef = useRef();
  const height = document.getElementById("root").clientWidth > 1400 ? 8 : 5.5;
  const DaysGenerator = useDayGenerator();
  const authCtx = useContext(AuthContext);
  const [diasMostrar, setDiasMostrar] = useState(null);
  const calendarioHandler = (horarios) => {
    let timeNeed = calcularTiempo(
      getElementById(inputState.HorariosFiltrados, inputState.Employee.value),
      inputState.servicios
    );
    let misHorarios = [];
    let i = 1;
    if (horarios.value.length > 0) {
      horarios.value.forEach((myH) => {
        misHorarios.push({
          id: i,
          title: `${myH.h}:${myH.m < 10 ? "0" + myH.m : myH.m}`,
        });
        i++;
      });
    } else {
      const Employee = getElementById(
        inputState.HorariosFiltrados,
        inputState.Employee.value
      );
      misHorarios = [...cargarHorariosEnMinutos(horarios.dia, Employee,timeNeed)];
    }
    dispatchInput({
      type: "CALENDARIO",
      value: misHorarios,
      dia: horarios.dia,
    });
  };
  /* Aqui se procesa y se manda la info en caso de esta correcta */
  const submitHandler = (event) => {
    event.preventDefault();
    let services = [];
    let timeNeed = calcularTiempo(
      getElementById(inputState.HorariosFiltrados, inputState.Employee.value),
      inputState.servicios
    );
    Object.values(inputState.servicios).forEach((serv) => {
      if (serv.active) {
        services.push(serv.id);
      }
    });
    if (services.length === 0) {
      const combo = document.getElementById("timeLeft");
      combo.className = `${combo.className} ${classes.invalidCombo}`;
      combo.focus();
    } else if (!inputState.Nombre.isValid) {
      nombreRef.current.focus();
    } else if (!inputState.Telefono.isValid) {
      telefonoRef.current.focus();
    } else if (inputState.Calendario.dia === null) {
      const cal = document.getElementById("Calendario");
      cal.className = `${cal.className} ${classes.invalidCal}`;
      cal.focus();
    } else {
      const year =
        inputState.Calendario.dia.m < date.getMonth() + 1
          ? new Date().getFullYear() + 1
          : new Date().getFullYear();
      const dia = String(inputState.Calendario.dia.d);
      const mes = String(inputState.Calendario.dia.m);
      const inicio =
        inputState.ComboBox.title.length < 5
          ? "0" + inputState.ComboBox.title
          : inputState.ComboBox.title;
      const fin = transformNumberString(
        minutosAHorarios(
          horarioEnMinutos(transformStringNumber(inicio)) + timeNeed
        )
      );
      let datosAgenda;
        /* const reserva = document.getElementById('reserva'); */
      if (props.agenda === null || props.agenda === undefined) {
        const user = authCtx.user;
        //Crear
        datosAgenda = {
          aceptada: inputState.manejoAgenda,
          ciCliente: (user === null||user.rol!=='Cliente') ? -1 : user.ciUsuario,
          nombreCliente: inputState.Nombre.value,
          telefono: inputState.Telefono.value,
          descripcion: inputState.Descripcion.value,
          imagenEjemplo: inputState.Referencia.value,
          ciEmpleado: inputState.Employee.value,
          servicios: services,
          fecha: `${year}-${mes.length > 1 ? mes : "0" + mes}-${
            dia.length > 1 ? dia : "0" + dia
          }`,
          horario: { i: inicio, f: fin },
        };
        /* reserva.blur(); */
        props.onSaveDatosAgenda(datosAgenda);
      } else {
        //Modificar
        const fechita = `${year}-${mes.length > 1 ? mes : "0" + mes}-${
          dia.length > 1 ? dia : "0" + dia
        }`;
        datosAgenda = {
          idAgenda: props.agenda.idagenda,
          nombreCliente: inputState.Nombre.value,
          telefono: inputState.Telefono.value,
          descripcion: inputState.Descripcion.value,
          imagenEjemplo: inputState.Referencia.value,
          servicios: services,
          fecha: fechita,
          horario: {
            idHorario: props.agenda.idHorario,
            i: inicio,
            f: fin,
            ciEmpleado: inputState.Employee.value,
            fecha: fechita,
          },
        };
        /* reserva.blur(); */
        props.onUpdateDatosAgenda(datosAgenda);
      }
    }
  };
  const changeEmployeeHandler = useCallback((id) => {
    dispatchInput({ type: "CHANGE_EMPLOYEE", value: id });
  }, []);
  const calendarioOnClick = useCallback(() => {
    dispatchInput({ type: "CLICK_EMPLOYEE" });
  }, []);
  let diasSeleccionables = [];
  let tiempoNecesario;
  const realDate = new Date();
  const date = new Date(
    realDate.getFullYear(),
    realDate.getMonth(),
    realDate.getDate()
  );
  const JSONDia = JSON.stringify(inputState.Calendario.dia);
  const activarDias = useCallback(
    (misDias) => {
      const dia = JSON.parse(JSONDia);
      let dias = [...misDias];
      if (dia !== null && dia !== undefined) {
        const diaSelect = dia.d;
        const mesSelect = dia.m;
        for (let i = 0; i < dias.length; i++) {
          for (let j = 0; j < dias[i].dias.length; j++) {
            const myDia = dias[i].dias[j];
            if (myDia.activo !== null) {
              if (myDia.num === diaSelect && myDia.mes === mesSelect) {
                dias[i].dias[j].activo = true;
              } else {
                dias[i].dias[j].activo = false;
              }
            }
          }
        }
      } else {
        for (let i = 0; i < dias.length; i++) {
          for (let j = 0; j < dias[i].dias.length; j++) {
            dias[i].dias[j].activo = false;
          }
        }
      }
      return dias;
    },
    [JSONDia]
  );

  const JSONHorariosFiltrados = JSON.stringify(inputState.HorariosFiltrados);
  const ciEmplo = inputState.Employee.value;
  const JSONservicios = JSON.stringify(inputState.servicios);

  const cargarDiasMostrar = useCallback(() => {
    let misDias;
    let misHorarios = JSON.parse(JSONHorariosFiltrados);
    let misServicios = JSON.parse(JSONservicios);
    if (misHorarios !== null && ciEmplo !== null) {
      tiempoNecesario = calcularTiempo(
        getElementById(misHorarios, ciEmplo),
        misServicios
      );
      const Empo = getElementById(misHorarios, ciEmplo);
      const fechas = JSON.stringify(Empo.fechas);
      const jornada = JSON.stringify(Empo.jornada);
      misDias = DaysGenerator(
        date.getDate(),
        date.getMonth() + 1,
        date.getFullYear(),
        fechas,
        tiempoNecesario,
        jornada
      );
      return activarDias(misDias);
    }
  }, [JSONHorariosFiltrados, ciEmplo, JSONservicios]);
  useEffect(() => {
    let misHorarios = JSON.parse(JSONHorariosFiltrados);
    if (misHorarios !== null && ciEmplo !== null) {
      setDiasMostrar(cargarDiasMostrar());
    }
  }, [JSONHorariosFiltrados, ciEmplo, JSONservicios, cargarDiasMostrar]);
  //Activación
  useEffect(() => {
    setDiasMostrar((prev) => activarDias(prev));
  }, [JSONDia]);
  //Inputs del sistema
  const INPUTS = [
    {
      id: 1,
      type: "text",
      value: inputState.Nombre.value,
      placeholder: "Ingrese su nombre",
      onChange: (event) => {
        dispatchInput({
          type: "USER_INPUT_NAME",
          value: event.target.value,
        });
      },
      onBlur: () => {
        dispatchInput({ type: "FOCUS_INPUT_NAME" });
      },
      onFocus: () => {
        dispatchInput({ type: "RESET_NAME_IS_VALID" });
      },
    },
    {
      id: 2,
      type: "number",
      min: "2000000",
      max: "99999999",
      value: inputState.Telefono.value,
      placeholder: "Ingrese su telefono",
      onChange: (event) => {
        dispatchInput({
          type: "USER_INPUT_PHONE",
          value: event.target.value,
        });
      },
      onBlur: () => {
        dispatchInput({ type: "FOCUS_INPUT_PHONE" });
      },
      onFocus: () => {
        dispatchInput({ type: "RESET_PHONE_IS_VALID" });
      },
    },
    {
      id: 3,
      rows: 4,
      value: inputState.Descripcion.value,
      placeholder: "Ingrese una descripción de lo que quiere hacerse",
      onChange: (event) => {
        dispatchInput({
          type: "USER_INPUT_DESC",
          value: event.target.value,
        });
      },
    },
    /* {
      id: 4,
      onChange: (event) => {
        dispatchInput({
          type: "USER_INPUT_REFERENCIA",
          value: event.target.value,
        });
      },
    }, */
  ];

  /* Este es el combo que aparece cuando se selecciona un día del calendario */
  /* En caso que no se haya hecho la precara de datos el combo es null */
  const combo =
    inputState.HorariosFiltrados === null ? null : (
      <div className={classes.ComboBox}>
        <ComboBox
          height={height}
          current={inputState.ComboBox.value}
          onChange={(id) => {
            dispatchInput({ type: "HORARIOS_SELECT", value: id });
          }}
          opciones={inputState.Calendario.value}
          onClick={() => {
            dispatchInput({ type: "HORARIOS_CLICK" });
          }}
          active={inputState.ComboBox.active}
        />
      </div>
    );

  /* Calendario con todas sus empleados y horarios */
  /* Si no se hizo la precarga de datos se carga null */
  let calendarioContent = null;
  if (inputState.HorariosFiltrados !== null && diasMostrar !== null) {
    calendarioContent = (
      <Calendario
        date={date}
        actividad={diasSeleccionables}
        getHorarios={calendarioHandler}
        empleados={inputState.HorariosFiltrados}
        diasAMostrar={diasMostrar}
        currentEmployee={inputState.Employee.value}
        comboEmployeeActive={inputState.Employee.active}
        changeEmployee={changeEmployeeHandler}
        onClick={calendarioOnClick}
      />
    );
  }
  return (
    <>
      <form onSubmit={submitHandler}>
        <div className={classes.nuevaAgenda}>
          <div className={classes.Inputs}>
            <CheckBoxAgenda
              servicios={inputState.servicios}
              time={calcularTiempo(
                getElementById(
                  inputState.HorariosFiltrados,
                  inputState.Employee.value
                ),
                inputState.servicios
              )}
              myAction={(action) => {
                const element = document.getElementById("timeLeft");
                if (element.classList[1] !== undefined) {
                  document
                    .getElementById("timeLeft")
                    .classList.remove(element.classList[1]);
                }
                dispatchInput(action);
              }}
            />

            {document.getElementById("root").clientWidth < 980 && (
              <div className={classes.Cal}>
                {calendarioContent}
                {inputState.Calendario.value !== null && combo}
              </div>
            )}
            <div className={classes.inputsGrid}>
              <div className={classes.label}>
                <label htmlFor="1">Nombre:</label>
              </div>
              <Input
                ref={nombreRef}
                isValid={inputState.Nombre.isValid}
                input={INPUTS[0]}
              />
              <div className={classes.label}>
                <label htmlFor="2">Teléfono:</label>
              </div>
              <Input
                ref={telefonoRef}
                isValid={inputState.Telefono.isValid}
                input={INPUTS[1]}
              />

              <div className={classes.label}>
                <label htmlFor="3">Descripción:</label>
              </div>
              <TextArea ref={descripcionRef} isValid={null} input={INPUTS[2]} />
            </div>
            {inputState.problema !== -1 && (
              <p>{inputState.problemas[inputState.problema].pro}</p>
            )}
            {/* <InputFile
              input={INPUTS[3]}
              label="Seleccione una foto de referencia"
            /> */}
          </div>
          {document.getElementById("root").clientWidth > 979 && (
            <div className={classes.Cal}>
              {calendarioContent}
              {inputState.Calendario.value !== null && combo}
            </div>
          )}
        </div>
        <Button id='reserva' type="submit">{`${
          props.agenda === null ? "Reservar" : "Modificar Reserva"
        }`}</Button>
      </form>
    </>
  );
};
export default FormularioAgenda;
