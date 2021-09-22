const inputs = (state, dispatch) => {
    return [
      {
        id: 1,
        disabled:!state.active,
        type: "number",
        value: state.Crear.cedula.value,
        placeholder: "Cédula",
        onChange: (event) => {
          dispatch({
            type: "CREAR_CI_I", 
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatch({ type: "CREAR_CI_B" });
        },
        onFocus: () => {
          dispatch({ type: "CREAR_CI_F" });
        },
      },
      {
        id: 2,
        disabled:!state.active,
        type: "text",
        value: state.Crear.monto.value,
        placeholder: "Monto",
        onChange: (event) => {
          dispatch({
            type: "CREAR_MONTO_I", 
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatch({ type: "CREAR_MONTO_B" });
        },
        onFocus: () => {
          dispatch({ type: "CREAR_MONTO_F" });
        },
      },
      {
        id: 3,
        disabled:!state.active,
        type: "number",
        value: state.Agregar.cedula.value,
        placeholder: "Cédula",
        onChange: (event) => {
          dispatch({
            type: "AGREGAR_CI_I", 
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatch({ type: "AGREGAR_CI_B" });
        },
        onFocus: () => {
          dispatch({ type: "AGREGAR_CI_F" });
        },
      },
      {
        id: 4,
        disabled:!state.active,
        type: "number",
        value: state.Agregar.monto.value,
        placeholder: "Monto",
        onChange: (event) => {
          dispatch({
            type: "AGREGAR_MONTO_I", 
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatch({ type: "AGREGAR_MONTO_B" });
        },
        onFocus: () => {
          dispatch({ type: "AGREGAR_MONTO_F" });
        },
      },
      {
        id: 5,
        type: "number",
        value: state.Modificar.cedulaAnterior.value,
        placeholder: "Cédula actual",
        onChange: (event) => {
          dispatch({
            type: "MODIFICAR_CI_A_I", 
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatch({ type: "MODIFICAR_CI_A_B" });
        },
        onFocus: () => {
          dispatch({ type: "MODIFICAR_CI_A_F" });
        },
      },
      {
        id: 6,
        type: "number",
        value: state.Modificar.cedulaNueva.value,
        placeholder: "Cédula nueva",
        onChange: (event) => {
          dispatch({
            type: "MODIFICAR_CI_N_I", 
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatch({ type: "MODIFICAR_CI_N_B" });
        },
        onFocus: () => {
          dispatch({ type: "MODIFICAR_CI_N_F" });
        },
      },
      {
        id: 7,
        type: "number",
        value: state.Modificar.monto.value,
        placeholder: "Monto",
        onChange: (event) => {
          dispatch({
            type: "MODIFICAR_MONTO_I", 
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatch({ type: "MODIFICAR_MONTO_B" });
        },
        onFocus: () => {
          dispatch({ type: "MODIFICAR_MONTO_F" });
        },
      },
      {
        id: 8,
        type: "number",
        value: state.Consultar.cedula.value,
        placeholder: "Cédula",
        onChange: (event) => {
          dispatch({
            type: "CONSULTAR_CI_I", 
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatch({ type: "CONSULTAR_CI_B" });
        },
        onFocus: () => {
          dispatch({ type: "CONSULTAR_CI_F" });
        },
      },
    ];
  };
  
  export default inputs;
  