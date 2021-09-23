import {
  calcularPrecio,
  getElementById,
  validarCedula,
} from "../../FuncionesAuxiliares/FuncionesAuxiliares";
import { formatDate } from "../../FuncionesAuxiliares/FuncionesAuxiliares";
import { resetAgendaProductos } from "./AuxiliaresCaja/reseteos";
import { validarMonto } from "../../FuncionesAuxiliares/FuncionesAuxiliares";
export const initialState = {
  idCaja: 1,
  fecha: new Date(),
  cajaAbierta: false,
  seguridadCierre: false,
  modalCierre: false,
  cajaInvalida: false,
  Cierre: null,
  montoInicial: { value: "", isValid: null },
  comboAgenda: { value: null, active: false },
  jornal: { value: "", show: false },
  sinAgendar: { value: false },
  soloHoy: { value: false },
  montoAgenda: { value: "", isValid: null },
  propinaAgenda: { value: "", isValid: null },
  montoProductos: { value: "", isValid: null },
  montoTotalProd: { value: "", isValid: null },
  productos: [],
  servicios: {
    corte: { id: 1, active: false },
    barba: { id: 4, active: false },
    maquina: { id: 5, active: false },
    claritos: { id: 6, active: false },
    decoloracion: { id: 7, active: false },
    brushing: { id: 8, active: false },
  },
  productosSAg: [],
  productosAgregados: [],
  productosSEl: [],
  agendas: [],
  agendasHoy: [],
  efectivo: { value: false },
  debito: { value: false },
  cuponera: { value: false },
  montoEfectivo: { value: "", isValid: null },
  montoDebito: { value: "", isValid: null },
  ticketDebito: { value: "", isValid: null },
  montoCuponera: { value: "", isValid: null },
  codCuponera: { value: "", isValid: null },
  cantidadMedios: { value: 0 },
  montoTotal: { value: "", isValid: null },
  showSalida: { value: false },
  montoSalida: { value: "", isValid: null },
  descripcionSalida: { value: "", isValid: null },
  comboSalida: { value: null, active: false },
  Empleados: [],
  Mensaje: { show: false, value: "" },
};

const orden = (a, b) => {
  return a.id - b.id;
};

const miFiltro = (lista, objetivo) => {
  let nuevaLista = [];
  let encontrado = null;
  lista.forEach((element) => {
    if (element.id !== objetivo.id) nuevaLista.push({ ...element });
    else encontrado = element.stock;
  });
  if (encontrado !== null) return { lista: [...nuevaLista], stock: encontrado }; //Es nueva lista
  return null; //No hay cambios
};

export const cajaReducer = (state, action) => {
  let valido = null;
  let validoTotal = null;
  let origen;
  let destino;
  let resultadoOrigen;
  let resultadoDestino;
  let total = 0;
  let mAgenda;
  let mPropina;
  let mProducto = 0;
  let anterior;
  let siguiente = null;
  let cantidad;
  let myState = null;
  let myStateMedios;
  let nuevoEstado;
  let listaBase;
  let posicion;
  let resto;
  let mEfectivo = null;
  let mDebito = null;
  let mCuponera = null;
  let efectivo;
  let debito;
  let cuponera;
  let date;
  let cajaAbierta;
  let newList;
  switch (action.type) {
    case 'CIERRE_TOTAL':
      return { ...state, modalCierre: false, seguridadCierre: false,cajaInvalida:false};
    case "SHOW_MENSAJE":
      return { ...state, Mensaje: { show: true, value: action.value } };
    case "HIDE_MENSAJE":
      return { ...state, Mensaje: { ...state.Mensaje.value, show: false } };
    case "SHOW_SEGURIDAD_CIERRE":
      return { ...state, seguridadCierre: true };
    case "HIDE_SEGURIDAD_CIERRE":
      return { ...state, seguridadCierre: false };
    case "ACEPTAR_SEGURIDAD_CIERRE":
      return { ...state, seguridadCierre: false, modalCierre: true };
    case "HIDE_MODAL":
      return { ...state, modalCierre: false };
    case "CARGAR_CIERRE":
      return { ...state, Cierre: action.payload };
    case "CARGAR_CIERRE_INVALIDO":
      return { ...state, Cierre: action.payload,modalCierre:true,cajaInvalida:true};
    case "ABRIR_CAJA":
      return {
        ...state,
        cajaAbierta: true,
        idCaja: action.Caja.idCaja,
        fecha: action.Caja.fecha,
      };
    case "CERRAR_CAJA":
      return {
        ...initialState,
        productos: [...state.productos],
        agendas: [...state.agendas],
        agendasHoy: [...state.agendasHoy],
      };
    case "CARGA_DE_DATOS":
      date = new Date();
      cajaAbierta = false;
      newList = action.payload.agendas.filter(
        (agenda) =>
          formatDate(agenda.fecha).getDate() === date.getDate() &&
          formatDate(agenda.fecha).getMonth() === date.getMonth()
      );
      if (action.payload.caja.idCaja !== -1) {
        cajaAbierta = true;
      }
      myState = {
        ...state,
        idCaja: action.payload.caja.idCaja,
        agendas: [...action.payload.agendas],
        agendasHoy: [...newList],
        Empleados: [...action.payload.empleados],
        productos: [...action.payload.productos],
        cajaAbierta: cajaAbierta,
        sinAgendar: { value: action.payload.agendas.length === 0 },
      };
      return { ...myState };
    case "RESET":
      date = new Date();
      cajaAbierta = false;
      newList = action.payload.agendas.filter(
        (agenda) =>
          formatDate(agenda.fecha).getDate() === date.getDate() &&
          formatDate(agenda.fecha).getMonth() === date.getMonth()
      );
      if (action.payload.caja.idCaja !== -1) {
        cajaAbierta = true;
      }
      myState = {
        ...state,
        ...initialState,
        idCaja: action.payload.caja.idCaja,
        agendas: [...action.payload.agendas],
        agendasHoy: [...newList],
        Empleados: [...action.payload.empleados],
        productos: [...action.payload.productos],
        cajaAbierta: cajaAbierta,
        sinAgendar: { value: action.payload.agendas.length === 0 },
      };
      return { ...myState, Mensaje: { show: true, value: action.value } };
    case "USER_INPUT_MONTO_I":
      return {
        ...state,
        montoInicial: {
          value: action.value,
          isValid: state.montoInicial.isValid,
        },
      };
    case "FOCUS_INPUT_MONTO_I":
      return {
        ...state,
        montoInicial: {
          value: state.montoInicial.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_MONTO_I":
      valido = validarMonto(state.montoInicial.value);
      return {
        ...state,
        montoInicial: {
          value: state.montoInicial.value,
          isValid: valido,
        },
      };
    case "SHOW_JORNAL":
      return {
        ...state,
        jornal: { value: action.value, show: true },
      };
    case "HIDE_JORNAL":
      return {
        ...state,
        jornal: { value: state.jornal.value, show: false },
      };
    case "CLICK_S_A":
      nuevoEstado = !state.sinAgendar.value;
      if (nuevoEstado) {
        listaBase = [...state.Empleados];
        posicion = listaBase[0].id;
      } else {
        listaBase = [...state.agendas];
        posicion = null;
      }
      total = parseInt(state.montoTotalProd.value, 10);
      if (total === 0) {
        total = "";
        validoTotal = null;
      } else {
        total = String(total);
        validoTotal = validarMonto(total);
      }
      return {
        ...state,
        sinAgendar: { value: nuevoEstado },
        soloHoy: { value: false },
        comboAgenda: { value: posicion, active: false },
        propinaAgenda: { value: "", isValid: null },
        servicios: { ...initialState.servicios },
        montoAgenda: { value: "", isValid: null },
      };
    case "CLICK_S_H":
      nuevoEstado = !state.soloHoy.value;
      posicion = state.comboAgenda.value;
      resto = { ...state.servicios };
      mAgenda = parseInt(state.montoAgenda.value, 10);
      mPropina = parseInt(state.propinaAgenda.value, 10);
      total = parseInt(state.montoTotal.value, 10);
      if (nuevoEstado) {
        listaBase = [...state.agendasHoy];
      } else {
        listaBase = [...state.agendas];
      }
      if (listaBase.length > 0) {
        if (getElementById(listaBase, posicion) === null) {
          posicion = null;
          resto = { ...initialState.servicios };
          mAgenda = "";
          mPropina = "";
          total = state.montoTotalProd.value;
        }
      } else {
        posicion = null;
        resto = { ...initialState.servicios };
        mAgenda = "";
        mPropina = "";
        total = state.montoTotalProd.value;
      }
      return {
        ...state,
        soloHoy: { value: nuevoEstado },
        servicios: { ...resto },
        comboAgenda: { value: posicion, active: false },
        montoAgenda: {
          value: String(mAgenda),
          isValid: validarMonto(String(mAgenda)),
        },
        propinaAgenda: {
          value: String(mPropina),
          isValid: validarMonto(String(mPropina)),
        },
        montoTotal: { value: String(total), isValid: String(total) },
      };
    case "CLICK_COMBO_AGENDA":
      return {
        ...state,
        comboAgenda: {
          value: state.comboAgenda.value,
          active: !state.comboAgenda.active,
        },
      };
    case "CHANGE_COMBO_AGENDA":
      mAgenda = 0;
      let baseServicios = {
        corte: { active: false, id: 1 },
        barba: { active: false, id: 4 },
        maquina: { active: false, id: 5 },
        claritos: { active: false, id: 6 },
        decoloracion: { active: false, id: 7 },
        brushing: { active: false, id: 8 },
      };
      if (!state.sinAgendar.value) {
        getElementById(state.agendas, action.value).servicios.forEach((s) => {
          switch (s) {
            case 1:
              baseServicios.corte.active = true;
              break;
            case 4:
              baseServicios.barba.active = true;
              break;
            case 5:
              baseServicios.maquina.active = true;
              break;
            case 6:
              baseServicios.claritos.active = true;
              break;
            case 7:
              baseServicios.decoloracion.active = true;
              break;
            case 8:
              baseServicios.brushing.active = true;
              break;
            default:
              break;
          }
        });
        mAgenda = calcularPrecio(baseServicios);
      }
      mPropina =
        state.propinaAgenda.value.length > 0
          ? parseInt(state.propinaAgenda.value, 10)
          : 0;
      mProducto =
        state.montoTotalProd.value.length > 0
          ? parseInt(state.montoTotalProd.value, 10)
          : 0;
      total = mProducto + mAgenda + mPropina;
      if (total === 0) {
        total = "";
        validoTotal = null;
      } else {
        total = String(total);
        validoTotal = validarMonto(total);
      }
      if (mAgenda === 0) {
        mAgenda = "";
        valido = null;
      } else {
        mAgenda = String(mAgenda);
        valido = validarMonto(mAgenda);
      }
      return {
        ...state,
        comboAgenda: { value: action.value, active: false },
        servicios: { ...baseServicios },
        montoAgenda: { value: mAgenda, isValid: valido },
        montoTotal: {
          value: total,
          isValid: validoTotal,
        },
      };
    case "CLICK_COMBO_SALIDA":
      return {
        ...state,
        comboSalida: {
          value: state.comboSalida.value,
          active: !state.comboSalida.active,
        },
      };
    case "CHANGE_COMBO_SALIDA":
      return {
        ...state,
        comboSalida: { value: action.value, active: false },
      };
    case "USER_INPUT_MONTO_A":
      if (state.montoAgenda.value.length === 0) resetAgendaProductos();
      mAgenda = action.value.length > 0 ? parseInt(action.value, 10) : 0;
      mProducto =
        state.montoTotalProd.value.length > 0
          ? parseInt(state.montoTotalProd.value, 10)
          : 0;
      mPropina =
        state.propinaAgenda.value.length > 0
          ? parseInt(state.propinaAgenda.value, 10)
          : 0;
      total = mAgenda + mProducto + mPropina;
      if (total === 0) {
        total = "";
        validoTotal = null;
      } else {
        total = String(total);
        validoTotal = validarMonto(total);
      }
      return {
        ...state,
        cantidadMedios: { value: 0 },
        efectivo: { value: false },
        debito: { value: false },
        cuponera: { value: false },
        montoAgenda: {
          value: action.value,
          isValid: state.montoAgenda.isValid,
        },
        montoTotal: {
          value: total,
          isValid: validoTotal,
        },
      };
    case "FOCUS_INPUT_MONTO_A":
      return {
        ...state,
        montoAgenda: {
          value: state.montoAgenda.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_MONTO_A":
      valido = validarMonto(state.montoAgenda.value);
      return {
        ...state,
        montoAgenda: {
          value: state.montoAgenda.value,
          isValid: valido,
        },
      };
    case "USER_INPUT_PROPINA_A":
      mPropina = action.value.length > 0 ? parseInt(action.value, 10) : 0;
      mProducto =
        state.montoTotalProd.value.length > 0
          ? parseInt(state.montoTotalProd.value, 10)
          : 0;
      mAgenda =
        state.montoAgenda.value.length > 0
          ? parseInt(state.montoAgenda.value, 10)
          : 0;
      total = mPropina + mProducto + mAgenda;
      if (total === 0) {
        total = "";
        validoTotal = null;
      } else {
        total = String(total);
        validoTotal = validarMonto(total);
      }
      return {
        ...state,
        cantidadMedios: { value: 0 },
        efectivo: { value: false },
        debito: { value: false },
        cuponera: { value: false },
        propinaAgenda: {
          value: action.value,
          isValid: state.propinaAgenda.isValid,
        },
        montoTotal: {
          value: total,
          isValid: validoTotal,
        },
      };
    case "FOCUS_INPUT_PROPINA_A":
      return {
        ...state,
        propinaAgenda: {
          value: state.propinaAgenda.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_PROPINA_A":
      valido = validarMonto(state.propinaAgenda.value);
      return {
        ...state,
        propinaAgenda: {
          value: state.propinaAgenda.value,
          isValid: valido,
        },
      };
    case "USER_INPUT_MONTO_PRODUCTO":
      return {
        ...state,
        montoProductos: {
          value: action.value,
          isValid: state.montoProductos.isValid,
        },
      };
    case "FOCUS_INPUT_MONTO_PRODUCTO":
      return {
        ...state,
        montoProductos: {
          value: state.montoProductos.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_MONTO_PRODUCTO":
      valido = validarMonto(state.montoProductos.value);
      return {
        ...state,
        montoProductos: {
          value: state.montoProductos.value,
          isValid: valido,
        },
      };
    case "USER_INPUT_MONTO_TOTAL_PRODUCTO":
      if (state.montoTotalProd.value.length === 0) resetAgendaProductos();
      mProducto = action.value.length > 0 ? parseInt(action.value, 10) : 0;
      mPropina =
        state.propinaAgenda.value.length > 0
          ? parseInt(state.propinaAgenda.value, 10)
          : 0;
      mAgenda =
        state.montoAgenda.value.length > 0
          ? parseInt(state.montoAgenda.value, 10)
          : 0;
      total = mProducto + mPropina + mAgenda;
      if (total === 0) {
        total = "";
        validoTotal = null;
      } else {
        total = String(total);
        validoTotal = validarMonto(total);
      }
      return {
        ...state,
        cantidadMedios: { value: 0 },
        efectivo: { value: false },
        debito: { value: false },
        cuponera: { value: false },
        montoTotalProd: {
          value: action.value,
          isValid: state.montoTotalProd.isValid,
        },
        montoTotal: {
          value: total,
          isValid: validoTotal,
        },
      };
    case "FOCUS_INPUT_MONTO_TOTAL_PRODUCTO":
      return {
        ...state,
        montoTotalProd: {
          value: state.montoTotalProd.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_MONTO_TOTAL_PRODUCTO":
      valido = validarMonto(state.montoTotalProd.value);
      return {
        ...state,
        montoTotalProd: {
          value: state.montoTotalProd.value,
          isValid: valido,
        },
      };
    case "CLICK_LISTA_P": //P = Productos
    case "CLICK_LISTA_A": //A = Agregados
      let auxList = [];
      let baseList;
      if (action.type === "CLICK_LISTA_P") {
        baseList = [...state.productosSAg];
      } else {
        baseList = [...state.productosSEl];
      }

      if (getElementById(baseList, action.value.id) === null) {
        auxList = [...baseList, action.value];
      } else {
        auxList = baseList.filter((prod) => prod.id !== action.value.id);
      }
      auxList.sort(orden);
      if (action.type === "CLICK_LISTA_P") {
        return {
          ...state,
          productosSAg: [...auxList],
        };
      } else
        return {
          ...state,
          productosSEl: [...auxList],
        };
    case "AGREGAR":
      origen = [...state.productos];
      destino = [...state.productosAgregados];
      if (state.productosSAg.length > 0) resetAgendaProductos();
      state.productosSAg.forEach((p) => {
        resultadoOrigen = miFiltro(origen, p);
        resultadoDestino = miFiltro(destino, p);
        cantidad =
          parseInt(action.value, 10) > resultadoOrigen.stock
            ? resultadoOrigen.stock
            : parseInt(action.value, 10);

        if (resultadoDestino !== null) {
          destino = [
            ...resultadoDestino.lista,
            { ...p, stock: resultadoDestino.stock + cantidad },
          ];
        } else {
          destino.push({ ...p, stock: cantidad });
        }
        resto = resultadoOrigen.stock - cantidad;
        origen = [...resultadoOrigen.lista, { ...p, stock: resto }];
      });
      origen.sort(orden);
      destino.sort(orden);
      destino.forEach((p) => {
        mProducto += p.price * p.stock;
      });
      //Calculo de totales
      mAgenda =
        state.montoAgenda.value.length > 0
          ? parseInt(state.montoAgenda.value, 10)
          : 0;
      mPropina =
        state.propinaAgenda.value.length > 0
          ? parseInt(state.propinaAgenda.value, 10)
          : 0;
      total = mAgenda + mProducto + mPropina;
      if (total === 0) {
        total = "";
        validoTotal = null;
      } else {
        total = String(total);
        validoTotal = validarMonto(total);
      }
      if (mProducto === 0) {
        mProducto = "";
        valido = null;
      } else {
        mProducto = String(mProducto);
        valido = validarMonto(mProducto);
      }
      return {
        ...state,
        cantidadMedios: { value: 0 },
        efectivo: { value: false },
        debito: { value: false },
        cuponera: { value: false },
        productosAgregados: [...destino],
        montoProductos: { value: "", isValid: null },
        productosSAg: [],
        montoTotalProd: { value: mProducto, isValid: valido },
        montoTotal: { value: total, isValid: validoTotal },
        productos: [...origen],
      };
    case "QUITAR":
      destino = [...state.productosAgregados];
      origen = [...state.productos];
      state.productosSEl.forEach((p) => {
        resultadoOrigen = miFiltro(origen, p);
        resultadoDestino = miFiltro(destino, p);
        cantidad =
          parseInt(action.value, 10) > resultadoDestino.stock
            ? resultadoDestino.stock
            : parseInt(action.value, 10);
        if (resultadoDestino.stock > cantidad) {
          destino = [
            ...resultadoDestino.lista,
            { ...p, stock: resultadoDestino.stock - cantidad },
          ];
        } else {
          destino = [...resultadoDestino.lista];
        }
        resto = resultadoOrigen.stock + cantidad;
        origen = [...resultadoOrigen.lista, { ...p, stock: resto }];
      });
      origen.sort(orden);
      destino.sort(orden);
      destino.forEach((p) => {
        mProducto += p.price * p.stock;
      });
      mAgenda =
        state.montoAgenda.value.length > 0
          ? parseInt(state.montoAgenda.value, 10)
          : 0;
      mPropina =
        state.propinaAgenda.value.length > 0
          ? parseInt(state.propinaAgenda.value, 10)
          : 0;
      total = String(mAgenda + mProducto + mPropina);
      mProducto = String(mProducto);
      return {
        ...state,
        productos: [...origen],
        cantidadMedios: { value: 0 },
        efectivo: { value: false },
        debito: { value: false },
        cuponera: { value: false },
        productosAgregados: [...destino],
        montoProductos: { value: "", isValid: null },
        productosSEl: [],
        montoTotalProd: { value: mProducto, isValid: validarMonto(mProducto) },
        montoTotal: { value: total, isValid: validarMonto(total) },
      };
    case "CLICK_EFECTIVO":
    case "CLICK_DEBITO":
    case "CLICK_CUPONERA":
      switch (action.type) {
        case "CLICK_EFECTIVO":
          siguiente = !state.efectivo.value;
          myState = { ...state, efectivo: { value: siguiente },montoEfectivo:{...initialState.montoEfectivo} };
          break;
        case "CLICK_DEBITO":
          siguiente = !state.debito.value;
          myState = { ...state, debito: { value: siguiente },montoDebito:{...initialState.montoDebito},ticketDebito:{...initialState.ticketDebito} };
          break;
        case "CLICK_CUPONERA":
          siguiente = !state.cuponera.value;
          myState = { ...state, cuponera: { value: siguiente },montoCuponera:{...initialState.montoCuponera},codCuponera:{...initialState.codCuponera} };
          break;
        default:
          break;
      }
      if (siguiente) cantidad = state.cantidadMedios.value + 1;
      else cantidad = state.cantidadMedios.value - 1;
      if (siguiente && state.cantidadMedios.value === 1) {
        total = state.montoTotal.value;
        valido = state.montoTotal.isValid;
        if (state.efectivo.value) anterior = "EFECTIVO";
        else if (state.debito.value) anterior = "DEBITO";
        else if (state.cuponera.value) anterior = "CUPONERA";
      } else if (cantidad === 1) {
        myState = {
          ...myState,
          montoEfectivo: { value: "", isValid: null },
          montoDebito: { value: "", isValid: null },
          montoCuponera: { value: "", isValid: null },
        };
      }
      myState = { ...myState, cantidadMedios: { value: cantidad } };
      switch (anterior) {
        case "EFECTIVO":
          myState = {
            ...myState,
            montoEfectivo: { value: total, isValid: valido },
          };
          break;
        case "DEBITO":
          myState = {
            ...myState,
            montoDebito: { value: total, isValid: valido },
          };
          break;
        case "CUPONERA":
          myState = {
            ...myState,
            montoCuponera: { value: total, isValid: valido },
          };
          break;
        default:
          break;
      }
      return { ...myState };
    case "USER_INPUT_EFECTIVO":
      mEfectivo = action.value === "" ? 0 : action.value;
      if (state.cantidadMedios.value === 2) {
        mDebito = "";
        mCuponera = "";
        if (state.debito.value) {
          mDebito = String(
            parseInt(state.montoTotal.value, 10) - parseInt(mEfectivo, 10)
          );
        } else {
          mCuponera = String(
            parseInt(state.montoTotal.value, 10) - parseInt(mEfectivo, 10)
          );
        }
      }
      break;
    case "FOCUS_INPUT_EFECTIVO":
      return {
        ...state,
        montoEfectivo: {
          value: state.montoEfectivo.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_EFECTIVO":
      valido = validarMonto(state.montoEfectivo.value);
      console.log(state.montoEfectivo.value);
      efectivo =state.montoEfectivo.value!==0&&state.montoEfectivo.value!=='';
      console.log(efectivo);
      cantidad = state.cantidadMedios.value;
      return {
        ...state,
        montoEfectivo: {
          value: state.montoEfectivo.value,
          isValid: valido,
        },
        efectivo:{value:efectivo},
        cantidadMedios:{value:!efectivo?cantidad-1:cantidad}
      };
    case "USER_INPUT_DEBITO":
      mDebito = action.value === "" ? 0 : action.value;
      if (state.cantidadMedios.value === 2) {
        mEfectivo = "";
        mCuponera = "";
        if (state.efectivo.value) {
          mEfectivo = String(
            parseInt(state.montoTotal.value, 10) - parseInt(mDebito, 10)
          );
        } else {
          mCuponera = String(
            parseInt(state.montoTotal.value, 10) - parseInt(mDebito, 10)
          );
        }
      }
      break;
    case "FOCUS_INPUT_DEBITO":
      return {
        ...state,
        montoDebito: {
          value: state.montoDebito.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_DEBITO":
      valido = validarMonto(state.montoDebito.value);
      debito =state.montoDebito.value!==0&&state.montoDebito.value!=='';
      cantidad = state.cantidadMedios.value;
      return {
        ...state,
        montoDebito: {
          value: state.montoDebito.value,
          isValid: valido,
        },
        debito:{value:debito},
        cantidadMedios:{value:!debito?cantidad-1:cantidad}
      };
    case "USER_INPUT_CUPONERA":
      mCuponera = action.value === "" ? 0 : action.value;
      if (state.cantidadMedios.value === 2) {
        mEfectivo = "";
        mDebito = "";
        if (state.efectivo.value) {
          mEfectivo = String(
            parseInt(state.montoTotal.value, 10) - parseInt(mCuponera, 10)
          );
        } else {
          mDebito = String(
            parseInt(state.montoTotal.value, 10) - parseInt(mCuponera, 10)
          );
        }
      }
      break;
    case "FOCUS_INPUT_CUPONERA":
      return {
        ...state,
        montoCuponera: {
          value: state.montoCuponera.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_CUPONERA":
      valido = validarMonto(state.montoCuponera.value);
      cuponera =state.montoCuponera.value!==0&&state.montoCuponera.value!=='';
      cantidad = state.cantidadMedios.value;
      return {
        ...state,
        montoCuponera: {
          value: state.montoCuponera.value,
          isValid: valido,
        },
        cuponera:{value:cuponera},
        cantidadMedios:{value:!cuponera?cantidad-1:cantidad}
      };
    case "USER_INPUT_TOTAL":
      return {
        ...state,
        cantidadMedios: { value: 0 },
        efectivo: { value: false },
        debito: { value: false },
        cuponera: { value: false },
        montoTotal: {
          value: action.value,
          isValid: state.montoTotal.isValid,
        },
      };
    case "FOCUS_INPUT_TOTAL":
      return {
        ...state,
        montoTotal: {
          value: state.montoTotal.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_TOTAL":
      valido = validarMonto(state.montoTotal.value);
      return {
        ...state,
        montoTotal: {
          value: state.montoTotal.value,
          isValid: valido,
        },
      };
    case "SHOW_SALIDA":
      return { ...state, showSalida: { value: true } };
    case "HIDE_SALIDA":
      return { ...state,
         showSalida: { value: false },
         comboSalida:{...initialState.comboSalida},
         montoSalida :{...initialState.montoSalida },
         descripcionSalida:{...initialState.descripcionSalida} };
    case "USER_INPUT_MONTO_S":
      return {
        ...state,
        montoSalida: {
          value: action.value,
          isValid: state.montoSalida.isValid,
        },
      };
    case "FOCUS_INPUT_MONTO_S":
      return {
        ...state,
        montoSalida: {
          value: state.montoSalida.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_MONTO_S":
      valido = validarMonto(state.montoSalida.value);
      return {
        ...state,
        montoSalida: {
          value: state.montoSalida.value,
          isValid: valido,
        },
      };
    case "USER_DESCRIPCION_SALIDA":
      return {
        ...state,
        descripcionSalida: {
          value: action.value,
          isValid: state.descripcionSalida.isValid,
        },
      };
    case "USER_COD_CUPONERA":
      return {
        ...state,
        codCuponera: {
          value: action.value,
          isValid: state.codCuponera.isValid,
        },
      };
    case "FOCUS_COD_CUPONERA":
      return {
        ...state,
        codCuponera: {
          value: state.codCuponera.value,
          isValid: null,
        },
      };
    case "BLUR_COD_CUPONERA":
      valido = validarCedula(state.codCuponera.value);
      return {
        ...state,
        codCuponera: {
          value: state.codCuponera.value,
          isValid: valido,
        },
      };
    case "USER_TICK_DEBITO":
      return {
        ...state,
        ticketDebito: {
          value: action.value,
          isValid: state.ticketDebito.isValid,
        },
      };
    case "FOCUS_TICK_DEBITO":
      return {
        ...state,
        ticketDebito: {
          value: state.ticketDebito.value,
          isValid: null,
        },
      };
    case "BLUR_TICK_DEBITO":
      valido = validarMonto(state.ticketDebito.value);
      return {
        ...state,
        ticketDebito: {
          value: state.ticketDebito.value,
          isValid: valido,
        },
      };
    case "CLICK_CORTE":
      myState = {
        ...state,
        servicios: {
          ...state.servicios,
          corte: {
            active: !state.servicios.corte.active,
            id: state.servicios.corte.id,
          },
          maquina: {
            active: false,
            id: state.servicios.maquina.id,
          },
        },
      };
      break;
    case "CLICK_BARBA":
      myState = {
        ...state,
        servicios: {
          ...state.servicios,
          barba: {
            active: !state.servicios.barba.active,
            id: state.servicios.barba.id,
          },
        },
      };
      break;
    case "CLICK_MAQUINA":
      myState = {
        ...state,
        servicios: {
          ...state.servicios,
          corte: {
            active: false,
            id: state.servicios.corte.id,
          },
          maquina: {
            active: !state.servicios.maquina.active,
            id: state.servicios.maquina.id,
          },
        },
      };
      break;
    case "CLICK_BRUSHING":
      myState = {
        ...state,
        servicios: {
          ...state.servicios,
          brushing: {
            active: !state.servicios.brushing.active,
            id: state.servicios.brushing.id,
          },
        },
      };
      break;
    case "CLICK_DECOLORACION":
      myState = {
        ...state,
        servicios: {
          ...state.servicios,
          decoloracion: {
            active: !state.servicios.decoloracion.active,
            id: state.servicios.decoloracion.id,
          },
        },
      };
      break;
    case "CLICK_CLARITOS":
      myState = {
        ...state,
        servicios: {
          ...state.servicios,
          claritos: {
            active: !state.servicios.claritos.active,
            id: state.servicios.claritos.id,
          },
        },
      };
      break;

    default:
      return { ...state };
  }
  if (myState !== null) {
    mAgenda = calcularPrecio(myState.servicios);
    mProducto =
      state.montoTotalProd.value.length > 0
        ? parseInt(state.montoTotalProd.value, 10)
        : 0;
    mPropina =
      state.propinaAgenda.value.length > 0
        ? parseInt(state.propinaAgenda.value, 10)
        : 0;
    total = mProducto + mAgenda + mPropina;
    if (total === 0) {
      total = "";
      validoTotal = null;
    } else {
      total = String(total);
      validoTotal = validarMonto(total);
    }
    if (mAgenda === 0) {
      mAgenda = "";
      valido = null;
    } else {
      mAgenda = String(mAgenda);
      valido = validarMonto(mAgenda);
    }
    myState = {
      ...myState,
      cantidadMedios: { value: 0 },
      efectivo: { value: false },
      debito: { value: false },
      cuponera: { value: false },
      montoAgenda: { value: mAgenda, isValid: valido },
      montoTotal: {
        value: total,
        isValid: validoTotal,
      },
    };
    return { ...myState };
  }
  if (myStateMedios !== null) {
    console.log(state);
    mEfectivo = mEfectivo !== null ? mEfectivo : state.montoEfectivo.value;
    mDebito = mDebito !== null ? mDebito : state.montoDebito.value;
    mCuponera = mCuponera !== null ? mCuponera : state.montoCuponera.value;
    myStateMedios = {
      ...state,
      montoEfectivo: {
        value: mEfectivo,
        isValid: state.efectivo.value?validarMonto(mEfectivo):null,
      },
      montoDebito: {
        value: mDebito,
        isValid: state.debito.value?validarMonto(mDebito):null,
      },
      montoCuponera: {
        value: mCuponera,
        isValid: state.cuponera.value?validarMonto(mCuponera):null,
      },
    };
    return { ...myStateMedios };
  }
};
