export const initialState = {
  agendas: null,
  agenda: null,
  inicio: 0,
  Mensaje: { show: false, value: "" },
};
export const reducer = (state, action) => {
  switch (action.type) {
    case "CARGAR":
      return { ...state, agendas: action.payload };
    case "SET_AGENDA":
      let agendaFinal;
      const agenda = action.payload;
      let misServicios = {
        barba: false,
        brushing: false,
        corte: false,
        claritos: false,
        decoloracion: false,
        maquina: false,
      };
      agenda.servicios.forEach((s) => {
        switch (s) {
          case 1:
            misServicios.corte = true;
            break;
          case 4:
            misServicios.barba = true;
            break;
          case 5:
            misServicios.maquina = true;
            break;
          case 6:
            misServicios.claritos = true;
            break;
          case 7:
            misServicios.decoloracion = true;
            break;
          case 8:
            misServicios.brushing = true;
            break;
          default:
            break;
        }
      });
      agendaFinal = {
        ...agenda,
        servicios: { ...misServicios },
        fecha: {
          d: parseInt(agenda.fecha.slice(8, 10), 10),
          m: parseInt(agenda.fecha.slice(5, 7), 10),
        },
      };

      return {
        ...state,
        agenda: { ...agendaFinal },
      };
    case "RESET":
      return {
        ...state,
        agenda: null,
        agendas: action.payload,
        Mensaje: { value: action.value, show: true },
      };
    case "SHOW_MENSAJE":
      return { ...state, Mensaje: { value: action.value, show: true } };
    case "HIDE_MENSAJE":
      return { ...state, Mensaje: { value: "", show: false } };
    case "AVANZAR":
      return { ...state, inicio: state.inicio + 1 };
    case "RETROCEDER":
      return { ...state, inicio: state.inicio - 1 };
  }
};
