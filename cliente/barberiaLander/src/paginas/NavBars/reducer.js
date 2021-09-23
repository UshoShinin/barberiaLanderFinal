import { validarMonto } from "../../FuncionesAuxiliares/FuncionesAuxiliares";
export const initialState = {
     place: -1, active: -1,
     Mensaje:{show:false,text:''},
     Modal:false,
     Minutos:{value:'',isValid:null},
     problema:'',
     empleados:null,
     empleado:{value:null,active:false},
     destino:{function:null,char:''},
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
        let empas =action.payload.filter( e => e.id!=='48279578');
        return {...state,empleados:[...empas],empleado:{value:empas[0].id,active:false},Modal:true,destino:action.destino}
    case 'CLICK':
        return {...state,empleado:{...state.empleado,active:!state.empleado.active}}
    case 'SELECT':
        return {...state,empleado:{value:action.value,active:false}}
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
        return { ...state, Mensaje: { show: true, text: action.value } };
    case "HIDE_MENSAJE":
        return { ...state, Mensaje: { ...state.Mensaje, show: false } };
    case 'SHOW_MODAL':
        return{...state,Modal:true,destino:action.destino};
    case "HIDE_MODAL":
        return { ...state, Modal: false };
    case "GUARDAR_CAJA":
        return { ...state, caja: action.value };
    default:
      return { ...state };
  }
};
