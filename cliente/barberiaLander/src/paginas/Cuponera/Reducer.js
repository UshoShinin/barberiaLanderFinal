import { validarMonto,validarCedula } from "../../FuncionesAuxiliares/FuncionesAuxiliares";
export const initialState = {
  idCaja: -1,
  active: false,
  Crear: {
    cedula: { value: "", isValid: null },
    monto: { value: "", isValid: null },
    problema: -1,
    problemas: [
      { id: 1, pro: "" },
      { id: 2, pro: "" },
      { id: 3, pro: "" },
    ],
  },
  Agregar: {
    cedula: { value: "", isValid: null },
    monto: { value: "", isValid: null },
    problema: -1,
    problemas: [
      { id: 1, pro: "" },
      { id: 2, pro: "" },
      { id: 3, pro: "" },
    ],
  },
  Modificar: {
    cedulaAnterior: { value: "", isValid: null },
    cedulaNueva: { value: "", isValid: null },
    monto: { value: "", isValid: null },
    problema: -1,
    problemas: [
      { id: 1, pro: "" }, //Cedula actual invalida
      { id: 2, pro: "" }, //Cedula nueva invalida
      { id: 3, pro: "" }, //monto invalido
      { id: 4, pro: "" }, //errores en submit
    ],
  },
  Consultar: {
    cedula: { value: "", isValid: null },
    problema: -1,
    problemas: [
      { id: 1, pro: "" },
      { id: 2, pro: "" },
    ],
  },
  Mensaje: { show: false, text: "" },
};

const ordenar = (a, b) => {
  return a.id - b.id;
};

const validarMontoEspecial = (value) => {
  if (value === "") return null;
  let monto = parseInt(value, 10);
  let largo = value.trim().length;
  if (largo !== String(monto).length) return false;
  return largo > 0 && monto >= 0;
};

export const reducer = (state, action) => {
  let valido = false;
  let problemasAux;
  let problem = -1;
  let myState;
  switch (action.type) {
    case "CARGAR_DATOS":
      return { ...state, idCaja: action.value, active: true };

    case "CREAR_CI_I":
      problemasAux = state.Crear.problemas.filter((p) => p.id !== 3);
      problemasAux = [...problemasAux, { id: 3, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.Crear.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Crear: {
          ...state.Crear,
          cedula: { value: action.value, isValid: state.Crear.cedula.isValid },
          problemas: [...problemasAux],
          problema: problem,
        },
      };
    case "CREAR_CI_F":
      return {
        ...state,
        Crear: {
          ...state.Crear,
          cedula: { value: state.Crear.cedula.value, isValid: null },
        },
      };
    case "CREAR_CI_B":
      valido = validarCedula(state.Crear.cedula.value);
      problemasAux = state.Crear.problemas.filter((p) => p.id !== 1);
      if (!valido)
        problemasAux = [
          ...problemasAux,
          {
            id: 1,
            pro: "Escriba la cédula sin puntos ni guiones, esta debe tener entre 7 y 8 carácteres",
          },
        ];
      else problemasAux = [...problemasAux, { id: 1, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.Crear.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Crear: {
          ...state.Crear,
          cedula: { value: state.Crear.cedula.value, isValid: valido },
          problemas: [...problemasAux],
          problema: problem,
        },
      };
    case "CREAR_PROBLEMA":
      problemasAux = state.Crear.problemas.filter((p) => p.id !== 3);
      problemasAux = [
        ...problemasAux,
        {
          id: 3,
          pro: action.value,
        },
      ];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.Crear.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Crear: {
          ...state.Crear,
          problemas: [...problemasAux],
          problema: problem,
        },
      };
    case "CREAR_MONTO_I":
      return {
        ...state,
        Crear: {
          ...state.Crear,
          monto: { value: action.value, isValid: state.Crear.cedula.isValid },
        },
      };
    case "CREAR_MONTO_B":
      valido = validarMontoEspecial(state.Crear.monto.value);
      problemasAux = state.Crear.problemas.filter((p) => p.id !== 2);
      if (valido === false) {
        problemasAux = [
          ...problemasAux,
          {
            id: 2,
            pro: "El monto debe ser un valor numérico mayor a 0",
          },
        ];
      } else problemasAux = [...problemasAux, { id: 2, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.Crear.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Crear: {
          ...state.Crear,
          monto: { value: state.Crear.monto.value, isValid: valido },
          problemas: [...problemasAux],
          problema: problem,
        },
      };
    case "CREAR_MONTO_F":
      return {
        ...state,
        Crear: {
          ...state.Crear,
          monto: { value: state.Crear.monto.value, isValid: null },
        },
      };

    case "AGREGAR_CI_I":
      problemasAux = state.Agregar.problemas.filter((p) => p.id !== 3);
      problemasAux = [...problemasAux, { id: 3, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.Crear.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Agregar: {
          ...state.Agregar,
          cedula: {
            value: action.value,
            isValid: state.Agregar.cedula.isValid,
          },
          problemas: [...problemasAux],
          problema: problem,
        },
      };
    case "AGREGAR_CI_F":
      return {
        ...state,
        Agregar: {
          ...state.Agregar,
          cedula: { value: state.Agregar.cedula.value, isValid: null },
        },
      };
    case "AGREGAR_CI_B":
      valido = validarCedula(state.Agregar.cedula.value);
      problemasAux = state.Agregar.problemas.filter((p) => p.id !== 1);
      if (!valido)
        problemasAux = [
          ...problemasAux,
          {
            id: 1,
            pro: "Escriba la cédula sin puntos ni guiones, esta debe tener entre 7 y 8 carácteres",
          },
        ];
      else problemasAux = [...problemasAux, { id: 1, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.Agregar.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Agregar: {
          ...state.Agregar,
          cedula: { value: state.Agregar.cedula.value, isValid: valido },
          problemas: [...problemasAux],
          problema: problem,
        },
      };
    case "AGREGAR_PROBLEMA":
      problemasAux = state.Agregar.problemas.filter((p) => p.id !== 3);
      problemasAux = [
        ...problemasAux,
        {
          id: 3,
          pro: action.value,
        },
      ];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.Agregar.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Agregar: {
          ...state.Agregar,
          problemas: [...problemasAux],
          problema: problem,
        },
      };
    case "AGREGAR_MONTO_I":
      return {
        ...state,
        Agregar: {
          ...state.Agregar,
          monto: { value: action.value, isValid: state.Crear.monto.isValid },
        },
      };
    case "AGREGAR_MONTO_F":
      return {
        ...state,
        Agregar: {
          ...state.Agregar,
          monto: { value: state.Agregar.monto.value, isValid: null },
        },
      };
    case "AGREGAR_MONTO_B":
      valido = validarMonto(state.Agregar.monto.value);
      problemasAux = state.Agregar.problemas.filter((p) => p.id !== 2);
      if (!valido) {
        problemasAux = [
          ...problemasAux,
          {
            id: 2,
            pro: "El monto debe ser un valor numérico mayor a 0",
          },
        ];
      } else problemasAux = [...problemasAux, { id: 2, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.Agregar.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Agregar: {
          ...state.Agregar,
          monto: { value: state.Agregar.monto.value, isValid: valido },
          problemas: [...problemasAux],
          problema: problem,
        },
      };

    case "MODIFICAR_CI_A_I":
      problemasAux = state.Modificar.problemas.filter((p) => p.id !== 4);
      problemasAux = [...problemasAux, { id: 4, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.Crear.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Modificar: {
          ...state.Modificar,
          cedulaAnterior: {
            value: action.value,
            isValid: state.Modificar.cedulaAnterior.isValid,
          },
          problemas: [...problemasAux],
          problema: problem,
        },
      };
    case "MODIFICAR_CI_A_F":
      return {
        ...state,
        Modificar: {
          ...state.Modificar,
          cedulaAnterior: {
            value: state.Modificar.cedulaAnterior.value,
            isValid: null,
          },
        },
      };
    case "MODIFICAR_CI_A_B":
      valido = validarCedula(state.Modificar.cedulaAnterior.value);
      problemasAux = state.Modificar.problemas.filter((p) => p.id !== 1);
      if (!valido)
        problemasAux = [
          ...problemasAux,
          {
            id: 1,
            pro: "Escriba la cédula anterior sin puntos ni guiones, esta debe tener entre 7 y 8 carácteres",
          },
        ];
      else problemasAux = [...problemasAux, { id: 1, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.Modificar.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Modificar: {
          ...state.Modificar,
          cedulaAnterior: {
            value: state.Modificar.cedulaAnterior.value,
            isValid: valido,
          },
          problemas: [...problemasAux],
          problema: problem,
        },
      };
    case "MODIFICAR_CI_N_I":
      problemasAux = state.Modificar.problemas.filter((p) => p.id !== 4);
      problemasAux = [...problemasAux, { id: 4, pro: "" }];
      for (let i = 0; i < state.Crear.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Modificar: {
          ...state.Modificar,
          cedulaNueva: {
            value: action.value,
            isValid: state.Modificar.cedulaNueva.isValid,
          },
          problemas: [...problemasAux],
          problema: problem,
        },
      };
    case "MODIFICAR_CI_N_F":
      return {
        ...state,
        Modificar: {
          ...state.Modificar,
          cedulaNueva: {
            value: state.Modificar.cedulaNueva.value,
            isValid: null,
          },
        },
      };
    case "MODIFICAR_CI_N_B":
      valido = validarCedula(state.Modificar.cedulaNueva.value, "Si");
      problemasAux = state.Modificar.problemas.filter((p) => p.id !== 2);
      if (valido === false)
        problemasAux = [
          ...problemasAux,
          {
            id: 2,
            pro: "Escriba la nueva cédula sin puntos ni guiones, esta debe tener entre 7 y 8 carácteres",
          },
        ];
      else problemasAux = [...problemasAux, { id: 2, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.Modificar.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Modificar: {
          ...state.Modificar,
          cedulaNueva: {
            value: state.Modificar.cedulaNueva.value,
            isValid: valido,
          },
          problemas: [...problemasAux],
          problema: problem,
        },
      };
    case "MODIFICAR_PROBLEMA":
      problemasAux = state.Modificar.problemas.filter((p) => p.id !== 4);
      problemasAux = [
        ...problemasAux,
        {
          id: 4,
          pro: action.value,
        },
      ];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.Modificar.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Modificar: {
          ...state.Modificar,
          problemas: [...problemasAux],
          problema: problem,
        },
      };
    case "MODIFICAR_MONTO_I":
      problemasAux = state.Modificar.problemas.filter((p) => p.id !== 4);
      problemasAux = [...problemasAux, { id: 4, pro: "" }];
      return {
        ...state,
        Modificar: {
          ...state.Modificar,
          monto: { value: action.value, isValid: state.Crear.monto.isValid },
          problemas: [...problemasAux],
          problema: problem,
        },
      };
    case "MODIFICAR_MONTO_F":
      return {
        ...state,
        Modificar: {
          ...state.Modificar,
          monto: { value: state.Modificar.monto.value, isValid: null },
        },
      };
    case "MODIFICAR_MONTO_B":
      valido = validarMontoEspecial(state.Modificar.monto.value);
      problemasAux = state.Modificar.problemas.filter((p) => p.id !== 3);
      if (valido === false) {
        problemasAux = [
          ...problemasAux,
          {
            id: 3,
            pro: "El monto debe ser un valor numérico mayor a 0",
          },
        ];
      } else problemasAux = [...problemasAux, { id: 3, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.Modificar.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Modificar: {
          ...state.Modificar,
          monto: { value: state.Modificar.monto.value, isValid: valido },
          problemas: [...problemasAux],
          problema: problem,
        },
      };

    case "CONSULTAR_CI_I":
      problemasAux = state.Consultar.problemas.filter((p) => p.id !== 2);
      problemasAux = [...problemasAux, { id: 2, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.Consultar.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Consultar: {
          ...state.Consultar,
          cedula: {
            value: action.value,
            isValid: state.Consultar.cedula.isValid,
          },
          problemas: [...problemasAux],
          problema: problem,
        },
      };
    case "CONSULTAR_CI_F":
      return {
        ...state,
        Consultar: {
          ...state.Consultar,
          cedula: { value: state.Consultar.cedula.value, isValid: null },
        },
      };
    case "CONSULTAR_CI_B":
      valido = validarCedula(state.Consultar.cedula.value);
      problemasAux = state.Consultar.problemas.filter((p) => p.id !== 1);
      if (!valido)
        problemasAux = [
          ...problemasAux,
          {
            id: 1,
            pro: "Escriba la cédula sin puntos ni guiones, esta debe tener entre 7 y 8 carácteres",
          },
        ];
      else problemasAux = [...problemasAux, { id: 1, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.Consultar.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Consultar: {
          ...state.Consultar,
          cedula: { value: state.Consultar.cedula.value, isValid: valido },
          problemas: [...problemasAux],
          problema: problem,
        },
      };
    case "CONSULTAR_PROBLEMA":
      problemasAux = state.Consultar.problemas.filter((p) => p.id !== 2);
      problemasAux = [
        ...problemasAux,
        {
          id: 2,
          pro: action.value,
        },
      ];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.Consultar.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        Consultar: {
          ...state.Consultar,
          problemas: [...problemasAux],
          problema: problem,
        },
      };

    case "SHOW_MENSAJE":
      switch (action.reset) {
        case "CREAR":
          myState = { ...state, Crear: { ...initialState.Crear } };
          break;
        case "AGREGAR":
          myState = { ...state, Agregar: { ...initialState.Agregar } };
          break;
        case "MODIFICAR":
          myState = { ...state, Modificar: { ...initialState.Modificar } };
          break;
        case "CONSULTAR":
          myState = { ...state, Consultar: { ...initialState.Consultar } };
          break;
        default:
          myState = { ...state };
      }
      return { ...myState, Mensaje: { show: true, text: action.value } };
    case "HIDE_MENSAJE":
      return { ...state, Mensaje: { ...state.Mensaje, show: false } };
    default:
      return { ...state };
  }
};
