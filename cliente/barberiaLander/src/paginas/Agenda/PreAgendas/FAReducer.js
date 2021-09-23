export const initialState = {
  aceptar: false,
  rechazar: false,
  preguntaAceptar: false,
  preguntaRechazar: false,
  agendas: null,
  agendaId: null,
  agendaAModificar: null,
  agendaSeleccionada : {
    IdAgenda: -1,
    servicios: {
      corte: false,
      barba: false,
      maquina: false,
      claritos: false,
      decoloracion: false,
      brushing: false,
    },
  },
  Mensaje:{show:false,value:''},
  Modal:{show:false,value:''},
};
export const reducer = (state, action) => {
  let myState;
  let manejo;
  switch (action.type) {
    case 'SHOW_MODAL':
      return {...state,Modal:{show:true,value:action.value}}
    case "CARGA":
      let misAgendas = [];
      manejo = action.manejo;
      action.payload.forEach((agenda) => {
        misAgendas.push({ ...agenda, fecha: agenda.fecha.slice(0, 10) });
      });
      return {
        ...state,
        agendaId: null,
        agendaAModificar: null,
        aceptar: manejo === 1,
        rechazar: manejo === -1,
        agendas: [...misAgendas],
      };
    case "GET_AGENDA":
      const agendita =
        action.agenda != null
          ? {
              ...action.agenda,
              fecha: {
                d: parseInt(action.agenda.fecha.slice(8, 10), 10),
                m: parseInt(action.agenda.fecha.slice(5, 7), 10),
              },
            }
          : null;
      return { ...state, agendaAModificar: agendita };
    case 'TOMAR_AGENDA':
      return {...state,agendaSeleccionada:action.value}
    case 'SOLTAR_AGENDA':
      return {...state,agendaSeleccionada:{...initialState.agendaSeleccionada}}
    case "SELECT_AGENDA":
      return { ...state, agendaId: action.value };
    case 'SHOW_PREGUNTA':
      return {...state,pregunta:{show:true,value:action.value}}
    case 'HIDE_PREGUNTA':
      return {...state,pregunta:{show:false,value:state.pregunta.value}}
    case 'PREGUNTA_ACEPTAR':
      return{...state,preguntaAceptar:!state.preguntaAceptar,preguntaRechazar:false};
    case 'PREGUNTA_RECHAZAR':
      return{...state,preguntaAceptar:false,preguntaRechazar:!state.preguntaRechazar};
    case 'RESPUESTA':
      manejo = action.value;
      myState = {...state,preguntaAceptar:false,preguntaRechazar:false};
      if(manejo!==null){
        myState = {...myState,aceptar:manejo==='1',rechazar:manejo==='-1'};
      }
      return{...myState}
    case 'SHOW_MENSAJE':
      return {...state,Mensaje:{show:true,value:action.value}};
    case 'HIDE_MENSAJE':
      return {...state,Mensaje:{show:false,value:state.Mensaje.value}};
    default:
      return { ...state };
  }
};
