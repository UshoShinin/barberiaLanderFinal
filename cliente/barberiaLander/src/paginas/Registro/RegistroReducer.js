import { validarCedula } from "../../FuncionesAuxiliares/FuncionesAuxiliares";
export const initialState = {
  ciUsuario: { value: "", isValid: null },
  nombre: { value: "", isValid: null },
  apellido: { value: "", isValid: null },
  telefono: { value: "", isValid: null },
  contra: { value: "", isValid: null },
  contraR: { value: "", isValid: null },
  problema: -1,
  problemas: [
    { id: 1, pro: "" },
    { id: 2, pro: "" },
    { id: 3, pro: "" },
    { id: 4, pro: "" },
    { id: 5, pro: "" },
    { id: 6, pro: "" },
  ],
  Mensaje:{show:false,text:''}
};

const ordenar = (a, b) => {
  return a.id - b.id;
};

const validarTelefono = (tel) => {
  const telefono = String(parseInt(tel.trim(), 10));
  return telefono.length === 8;
};
const validarContraseña = (con) => {
  let letras = 0;
  let numeros = 0;
  let problema = "";
  let valido = false;
  if (con.length > 7 && con.length < 17) {
    for (let i = 0; i < con.length; i++) {
      if (
        (con.charCodeAt(i) > 64 && con.charCodeAt(i) < 91) ||
        (con.charCodeAt(i) > 96 && con.charCodeAt(i) < 123) ||
        (con.charCodeAt(i) > 127 && con.charCodeAt(i) < 155) ||
        (con.charCodeAt(i) > 159 && con.charCodeAt(i) < 166) ||
        (con.charCodeAt(i) > 180 && con.charCodeAt(i) < 184) ||
        (con.charCodeAt(i) > 197 && con.charCodeAt(i) < 200) ||
        (con.charCodeAt(i) > 207 && con.charCodeAt(i) < 217) ||
        (con.charCodeAt(i) > 221 &&
          con.charCodeAt(i) < 238 &&
          con.charCodeAt(i) !== 223)
      ) {
        letras++;
      } else if (con.charCodeAt(i) > 47 && con.charCodeAt(i) < 58) {
        numeros++;
      }
    }
    if (letras > 5) {
      if (numeros > 0) {
        valido = true;
      } else {
        problema = "La contraseña debe tener al menos 1 número";
      }
    } else {
      problema = "La contraseña debe tener al menos 6 letras";
    }
  } else {
    problema = "La contraseña debe tener entre 8 y 16 caracteres";
  }
  return { valido, problema };
};

export const reducer = (state, action) => {
  let valido = false;
  let validoAux = false;
  let problemasAux;
  let problem = -1;
  switch (action.type) {
    case "INPUT_CI_U":
      return {
        ...state,
        ciUsuario: { value: action.value, isValid: state.ciUsuario.isValid },
      };
    case "FOCUS_CI_U":
      return {
        ...state,
        ciUsuario: {
          value: state.ciUsuario.value,
          isValid: null,
        },
      };
    case "BLUR_CI_U":
      valido = validarCedula(state.ciUsuario.value);
      problemasAux = state.problemas.filter((p) => p.id !== 1);
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
      for (let i = 0; i < state.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        ciUsuario: {
          value: state.ciUsuario.value,
          isValid: valido,
        },
        problemas: [...problemasAux],
        problema: problem,
      };

    case "INPUT_NOM":
      return {
        ...state,
        nombre: { value: action.value, isValid: state.nombre.isValid },
      };
    case "FOCUS_NOM":
      return {
        ...state,
        nombre: {
          value: state.nombre.value,
          isValid: null,
        },
      };
    case "BLUR_NOM":
      valido = state.nombre.value.trim().length > 2;
      problemasAux = state.problemas.filter((p) => p.id !== 2);
      if (!valido)
        problemasAux = [
          ...problemasAux,
          { id: 2, pro: "El nombre debe tener más de 2 carácteres" },
        ];
      else problemasAux = [...problemasAux, { id: 2, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        nombre: {
          value: state.nombre.value,
          isValid: valido,
        },
        problemas: [...problemasAux],
        problema: problem,
      };

    case "INPUT_APE":
      return {
        ...state,
        apellido: { value: action.value, isValid: state.apellido.isValid },
      };
    case "FOCUS_APE":
      return {
        ...state,
        apellido: {
          value: state.apellido.value,
          isValid: null,
        },
      };
    case "BLUR_APE":
      valido = state.apellido.value.trim().length > 2;
      problemasAux = state.problemas.filter((p) => p.id !== 3);
      if (!valido)
        problemasAux = [
          ...problemasAux,
          { id: 3, pro: "El apellido debe tener más de 2 carácteres" },
        ];
      else problemasAux = [...problemasAux, { id: 3, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        apellido: {
          value: state.apellido.value,
          isValid: state.apellido.value.trim().length > 2,
        },
        problemas: [...problemasAux],
        problema: problem,
      };

    case "INPUT_TEL":
      return {
        ...state,
        telefono: { value: action.value, isValid: state.telefono.isValid },
      };
    case "FOCUS_TEL":
      return {
        ...state,
        telefono: {
          value: state.telefono.value,
          isValid: null,
        },
      };
    case "BLUR_TEL":
      valido = validarTelefono(state.telefono.value);
      problemasAux = state.problemas.filter((p) => p.id !== 4);
      if (!valido)
        problemasAux = [
          ...problemasAux,
          { id: 4, pro: "El telefono deber ser un número de 8 dígitos" },
        ];
      else problemasAux = [...problemasAux, { id: 4, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        telefono: {
          value: state.telefono.value,
          isValid: valido,
        },
        problemas: [...problemasAux],
        problema: problem,
      };

    case "INPUT_CONT":
      return {
        ...state,
        contra: { value: action.value, isValid: state.contra.isValid },
      };
    case "FOCUS_CONT":
      return {
        ...state,
        contra: {
          value: state.contra.value,
          isValid: null,
        },
      };
    case "BLUR_CONT":
      valido = validarContraseña(state.contra.value);
      validoAux =
        state.contraR.value === state.contra.value && state.contra.isValid;
      problemasAux = state.problemas.filter((p) => p.id !== 5 && p.id !== 6);
      if (!valido.value)
        problemasAux = [...problemasAux, { id: 5, pro: valido.problema }];
      else problemasAux = [...problemasAux, { id: 5, pro: "" }];
      if (!validoAux)
        problemasAux = [
          ...problemasAux,
          {
            id: 6,
            pro: "La contraseña y la repetición de contraseña deben coincidir",
          },
        ];
      else problemasAux = [...problemasAux, { id: 6, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        contra: {
          value: state.contra.value,
          isValid: valido.valido,
        },
        problemas: [...problemasAux],
        problema: problem,
        contraR: {
          value: state.contraR.value,
          isValid: validoAux,
        },
      };
    case "INPUT_CONT2":
      return {
        ...state,
        contraR: { value: action.value, isValid: state.contraR.isValid },
      };
    case "FOCUS_CONT2":
      return {
        ...state,
        contraR: {
          value: state.contraR.value,
          isValid: null,
        },
      };
    case "BLUR_CONT2":
      valido = state.contraR.value === state.contra.value;
      problemasAux = state.problemas.filter((p) => p.id !== 6);
      if (!valido)
        problemasAux = [
          ...problemasAux,
          {
            id: 6,
            pro: "La contraseña y la repetición de contraseña deben coincidir",
          },
        ];
      else problemasAux = [...problemasAux, { id: 6, pro: "" }];
      problemasAux.sort(ordenar);
      for (let i = 0; i < state.problemas.length; i++) {
        if (problemasAux[i].pro !== "") {
          problem = i;
          break;
        }
      }
      return {
        ...state,
        contraR: {
          value: state.contraR.value,
          isValid: valido,
        },
        problemas: [...problemasAux],
        problema: problem,
      };
    
    case 'SHOW_MENSAJE':

      return {...state,Mensaje:{show:true,text:action.value}}
    case 'HIDE_MENSAJE':
      return {...state,Mensaje:{show:false,text:state.Mensaje.value}}
      default:
      return { ...state };
  }
};
