const inputs = (state,dispatch) => {
    return [
      {
        id: 1,
        type: "number",
        value: state.ciEmpleado.value,
        placeholder: "Cédula Empleado",
        onChange: (event) => {
          dispatch({
            type: "INPUT_CI_E",
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatch({ type: "BLUR_CI_E" });
        },
        onFocus: () => {
          dispatch({ type: "FOCUS_CI_E" });
        },
      },
      {
        id: 2,
        type: "number",
        value: state.ciCliente.value,
        placeholder: "Cédula Cliente",
        onChange: (event) => {
          dispatch({
            type: "INPUT_CI_C",
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatch({ type: "BLUR_CI_C" });
        },
        onFocus: () => {
          dispatch({ type: "FOCUS_CI_C" });
        },
      },
    ];
  };
  
  export default inputs;