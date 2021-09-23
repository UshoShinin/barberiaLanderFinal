import { validarCedula } from "../../FuncionesAuxiliares/FuncionesAuxiliares";
export const initialState = {
  ciUsuario: { value: "", isValid: null },
  contra: { value: "", isValid: null },
  contra1: { value: "", isValid: null },
  contra2: { value: "", isValid: null },
  modal : false,
  Mensaje:{show:false,value:''},
  identificador:0,
  problema: -1,
  problemas: [
    { id: 1, pro: "" },
    { id: 2, pro: "" },
    { id: 3, pro: "" },
    { id: 4, pro: "" },
  ],
};


const ordenar = (a, b) => {
  return a.id - b.id;
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
      problemasAux = state.problemas.filter((p) => p.id !== 2);
      if (!valido.value)
        problemasAux = [...problemasAux, { id: 2, pro: valido.problema }];
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
        contra: {
          value: state.contra.value,
          isValid: valido.valido,
        },
        problemas: [...problemasAux],
        problema: problem,
      };

    //Modal
    case "INPUT_CONT1":
      return {
        ...state,
        contra1: { value: action.value, isValid: state.contra1.isValid },
      };
    case "FOCUS_CONT1":
      return {
        ...state,
        contra1: {
          value: state.contra1.value,
          isValid: null,
        },
      };
    case "BLUR_CONT1":
      valido = validarContraseña(state.contra1.value);
      problemasAux = state.problemas.filter((p) => p.id !== 3);
      if (!valido.value)
        problemasAux = [...problemasAux, { id: 3, pro: valido.problema }];
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
        contra1: {
          value: state.contra1.value,
          isValid: valido.valido,
        },
        problemas: [...problemasAux],
        problema: problem,
      };

    case "INPUT_CONT2":
      return {
        ...state,
        contra2: { value: action.value, isValid: state.contra2.isValid },
      };
    case "FOCUS_CONT2":
      return {
        ...state,
        contra2: {
          value: state.contra2.value,
          isValid: null,
        },
      };
    case "BLUR_CONT2":
      valido = state.contra1.value===state.contra2.value;
      problemasAux = state.problemas.filter((p) => p.id !== 4);
      if (!valido)
        problemasAux = [
          ...problemasAux,
          {
            id: 4,
            pro: "La contraseña y la repeticion deben ser iguales",
          },
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
        contra2: {
          value: state.contra2.value,
          isValid: valido,
        },
        problemas: [...problemasAux],
        problema: problem,
      };
    case 'SHOW_MENSAJE':
      return {...state,Mensaje:{show:true,value:action.value}}
    case 'HIDE_MENSAJE':
      return {...state,Mensaje:{show:false,value:''}}
    case 'MODAL':
      return {...state,modal:true,identificador:action.value==='Cliente'?2:1};
      case 'CLOSE_MODAL':
      return {...state,...initialState};
    default:
      return { ...state };
  }
};

