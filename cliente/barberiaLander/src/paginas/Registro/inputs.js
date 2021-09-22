const inputs = (registerState,dispatchCaja) => {
    return [
      {
        id: 1,
        type: "number",
        value: registerState.ciUsuario.value,
        placeholder: "Cédula",
        onChange: (event) => {
          dispatchCaja({
            type: "INPUT_CI_U",
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatchCaja({ type: "BLUR_CI_U" });
        },
        onFocus: () => {
          dispatchCaja({ type: "FOCUS_CI_U" });
        },
      },
      {
        id: 2,
        type: "text",
        value: registerState.nombre.value,
        placeholder: "Nombre",
        onChange: (event) => {
          dispatchCaja({
            type: "INPUT_NOM",
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatchCaja({ type: "BLUR_NOM" });
        },
        onFocus: () => {
          dispatchCaja({ type: "FOCUS_NOM" });
        },
      },
      {
        id: 3,
        type: "text",
        value: registerState.apellido.value,
        placeholder: "Apellido",
        onChange: (event) => {
          dispatchCaja({
            type: "INPUT_APE",
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatchCaja({ type: "BLUR_APE" });
        },
        onFocus: () => {
          dispatchCaja({ type: "FOCUS_APE" });
        },
      },
      {
        id: 4,
        type: "number",
        value: registerState.telefono.value,
        placeholder: "Teléfono",
        onChange: (event) => {
          dispatchCaja({
            type: "INPUT_TEL",
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatchCaja({ type: "BLUR_TEL" });
        },
        onFocus: () => {
          dispatchCaja({ type: "FOCUS_TEL" });
        },
      },
      {
        id: 5,
        type: "password",
        value: registerState.contra.value,
        placeholder: "Contraseña",
        onChange: (event) => {
          dispatchCaja({
            type: "INPUT_CONT",
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatchCaja({ type: "BLUR_CONT" });
        },
        onFocus: () => {
          dispatchCaja({ type: "FOCUS_CONT" });
        },
      },
      {
        id: 6,
        type: "password",
        value: registerState.contraR.value,
        placeholder: "Repetir",
        onChange: (event) => {
          dispatchCaja({
            type: "INPUT_CONT2",
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatchCaja({ type: "BLUR_CONT2" });
        },
        onFocus: () => {
          dispatchCaja({ type: "FOCUS_CONT2" });
        },
      },
    ];
  };
  
  export default inputs;