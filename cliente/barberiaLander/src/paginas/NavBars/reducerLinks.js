import { validarMonto } from "../../FuncionesAuxiliares/FuncionesAuxiliares";
export const initialState = {place: -1, active: -1};
export const reducer = (state, action) => {
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
    default:
      return { ...state };
  }
};
