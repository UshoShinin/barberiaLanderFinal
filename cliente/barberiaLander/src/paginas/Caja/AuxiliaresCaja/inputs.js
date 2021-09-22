const inputs = (cajaState,dispatchCaja) => {
  return [
    {
      id: 1,
      type: "number",
      value: cajaState.montoInicial.value,
      placeholder: "0",
      disabled: cajaState.cajaAbierta,
      onChange: (event) => {
        dispatchCaja({
          type: "USER_INPUT_MONTO_I",
          value: event.target.value,
        });
      },
      onBlur: () => {
        dispatchCaja({ type: "BLUR_INPUT_MONTO_I" });
      },
      onFocus: () => {
        dispatchCaja({ type: "FOCUS_INPUT_MONTO_I" });
      },
    },
    {
      id: 2,
      type: "number",
      value: cajaState.montoAgenda.value,
      placeholder: "0",
      disabled: !cajaState.cajaAbierta,
      onChange: (event) => {
        dispatchCaja({
          type: "USER_INPUT_MONTO_A",
          value: event.target.value,
        });
      },
      onBlur: () => {
        dispatchCaja({ type: "BLUR_INPUT_MONTO_A" });
      },
      onFocus: () => {
        dispatchCaja({ type: "FOCUS_INPUT_MONTO_A" });
      },
    },
    {
      id: 3,
      type: "number",
      value: cajaState.propinaAgenda.value,
      placeholder: "0",
      disabled: !cajaState.cajaAbierta,
      onChange: (event) => {
        dispatchCaja({
          type: "USER_INPUT_PROPINA_A",
          value: event.target.value,
        });
      },
      onBlur: () => {
        dispatchCaja({ type: "BLUR_INPUT_PROPINA_A" });
      },
      onFocus: () => {
        dispatchCaja({ type: "FOCUS_INPUT_PROPINA_A" });
      },
    },
    {
      id: 4,
      type: "number",
      value: cajaState.montoProductos.value,
      placeholder: "1",
      disabled: !cajaState.cajaAbierta,
      onChange: (event) => {
        dispatchCaja({
          type: "USER_INPUT_MONTO_PRODUCTO",
          value: event.target.value,
        });
      },
      onBlur: () => {
        dispatchCaja({ type: "BLUR_INPUT_MONTO_PRODUCTO" });
      },
      onFocus: () => {
        dispatchCaja({ type: "FOCUS_INPUT_MONTO_PRODUCTO" });
      },
    },
    {
      id: 5,
      type: "number",
      value: cajaState.montoTotalProd.value,
      placeholder: "0",
      disabled: !cajaState.cajaAbierta,
      onChange: (event) => {
        dispatchCaja({
          type: "USER_INPUT_MONTO_TOTAL_PRODUCTO",
          value: event.target.value,
        });
      },
      onBlur: () => {
        dispatchCaja({ type: "BLUR_INPUT_MONTO_TOTAL_PRODUCTO" });
      },
      onFocus: () => {
        dispatchCaja({
          type: "FOCUS_INPUT_MONTO_TOTAL_PRODUCTO",
        });
      },
    },
    {
      id: 6,
      type: "number",
      value: cajaState.montoEfectivo.value,
      placeholder: "0",
      disabled: !cajaState.cajaAbierta || !cajaState.efectivo.value,
      onChange: (event) => {
        dispatchCaja({
          type: "USER_INPUT_EFECTIVO",
          value: event.target.value,
        });
      },
      onBlur: () => {
        dispatchCaja({ type: "BLUR_INPUT_EFECTIVO" });
      },
      onFocus: () => {
        dispatchCaja({ type: "FOCUS_INPUT_EFECTIVO" });
      },
    },
    {
      id: 7,
      type: "number",
      value: cajaState.montoDebito.value,
      placeholder: "0",
      disabled: !cajaState.cajaAbierta || !cajaState.debito.value,
      onChange: (event) => {
        dispatchCaja({
          type: "USER_INPUT_DEBITO",
          value: event.target.value,
        });
      },
      onBlur: () => {
        dispatchCaja({ type: "BLUR_INPUT_DEBITO" });
      },
      onFocus: () => {
        dispatchCaja({ type: "FOCUS_INPUT_DEBITO" });
      },
    },
    {
      id: 8,
      type: "number",
      value: cajaState.montoCuponera.value,
      placeholder: "0",
      disabled: !cajaState.cajaAbierta || !cajaState.cuponera.value,
      onChange: (event) => {
        dispatchCaja({
          type: "USER_INPUT_CUPONERA",
          value: event.target.value,
        });
      },
      onBlur: () => {
        dispatchCaja({ type: "BLUR_INPUT_CUPONERA" });
      },
      onFocus: () => {
        dispatchCaja({ type: "FOCUS_INPUT_CUPONERA" });
      },
    },
    {
      id: 9,
      type: "number",
      value: cajaState.montoTotal.value,
      placeholder: "0",
      disabled: !cajaState.cajaAbierta,
      onChange: (event) => {
        dispatchCaja({
          type: "USER_INPUT_TOTAL",
          value: event.target.value,
        });
      },
      onBlur: () => {
        dispatchCaja({ type: "BLUR_INPUT_TOTAL" });
      },
      onFocus: () => {
        dispatchCaja({ type: "FOCUS_INPUT_TOTAL" });
      },
    },
    {
      id: 10,
      type: "number",
      value: cajaState.montoSalida.value,
      placeholder: "0",
      disabled: !cajaState.cajaAbierta,
      onChange: (event) => {
        dispatchCaja({
          type: "USER_INPUT_MONTO_S",
          value: event.target.value,
        });
      },
      onBlur: () => {
        dispatchCaja({ type: "BLUR_INPUT_MONTO_S" });
      },
      onFocus: () => {
        dispatchCaja({ type: "FOCUS_INPUT_MONTO_S" });
      },
    },
    {
      id: 11,
      rows: 4,
      value: cajaState.descripcionSalida.value,
      placeholder: "Escribe la razón de esta salida de dinero",
      disabled: !cajaState.cajaAbierta,
      onChange: (event) => {
        dispatchCaja({
          type: "USER_DESCRIPCION_SALIDA",
          value: event.target.value,
        });
      },
      onBlur: () => {
        dispatchCaja({ type: "BLUR_DESCRIPCION_SALIDA" });
      },
      onFocus: () => {
        dispatchCaja({ type: "FOCUS_DESCRIPCION_SALIDA" });
      },
    },
    {
      id: 12,
      type: "number",
      value: cajaState.codCuponera.value,
      placeholder: "Cédula cliente",
      disabled: !cajaState.cajaAbierta,
      onChange: (event) => {
        dispatchCaja({
          type: "USER_COD_CUPONERA",
          value: event.target.value,
        });
      },
      onBlur: () => {
        dispatchCaja({ type: "BLUR_COD_CUPONERA" });
      },
      onFocus: () => {
        dispatchCaja({ type: "FOCUS_COD_CUPONERA" });
      },
    },
    {
      id: 13,
      type: "number",
      value: cajaState.ticketDebito.value,
      placeholder: "Ticket débito",
      disabled: !cajaState.cajaAbierta,
      onChange: (event) => {
        dispatchCaja({
          type: "USER_TICK_DEBITO",
          value: event.target.value,
        });
      },
      onBlur: () => {
        dispatchCaja({ type: "BLUR_TICK_DEBITO" });
      },
      onFocus: () => {
        dispatchCaja({ type: "FOCUS_TICK_DEBITO" });
      },
    },
  ];
};

export default inputs;