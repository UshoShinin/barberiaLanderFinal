import { validarMonto } from "../../FuncionesAuxiliares/FuncionesAuxiliares";
export const initialState = {
     place: -1, active: -1,
     Mensaje:{show:false,text:''},
     Modal:false,
     Minutos:{value:'',isValid:null},
     problema:'',
     empleados:null,
     empleado:null,
     destino:null,
     caja:null
    };
export const reducer = (state, action) => {
    let valido = false;
  switch (action.type) {
    case "RESET":
      return {...state, place: -1, active: -1 };
    case "CHANGE_PLACE":
      return {...state, place: action.value, active: -1 };
    case "CHANGE_ACTIVE":
      return {...state,
        place: -1,
        active: state.active === action.value ? -1 : action.value,
      };
    case 'CARGAR':
        return{...state,empleados:[...action.payload],Modal:true,action:action.destino}
    case "USER_MINUTOS":
        return {
            ...state,
            Minutos:{...state.Minutos,value:action.value},
        };
    case "FOCUS_MINUTOS":
        return {
            ...state,
            Minutos:{...state.Minutos,isValid:null},
        };
    case "BLUR_MINUTOS":
        valido = validarMonto(state.Minutos.value);
        return {
            ...state,
            Minutos:{...state.Minutos,isValid:valido},
            problema:!valido?'Los minutos debe ser un número entero, positivo de máximo 6 carácteres':'',
        };
    case "SHOW_MENSAJE":
        console.log(action.value);
        return { ...state, Mensaje: { show: true, text: action.value } };
    case "HIDE_MENSAJE":
        return { ...state, Mensaje: { ...state.Mensaje, show: false } };
    case "GUARDAR_CAJA":
        return { ...state, caja: action.value };
    default:
      return { ...state };
  }
};
