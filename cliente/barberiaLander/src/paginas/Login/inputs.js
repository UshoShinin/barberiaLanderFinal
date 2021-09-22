const inputs = (registerState, dispatchCaja) => {
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
      id: 3,
      type: "password",
      value: registerState.contra1.value,
      placeholder: "Contraseña",
      onChange: (event) => {
        dispatchCaja({
          type: "INPUT_CONT1",
          value: event.target.value,
        });
      },
      onBlur: () => {
        dispatchCaja({ type: "BLUR_CONT1" });
      },
      onFocus: () => {
        dispatchCaja({ type: "FOCUS_CONT1" });
      },
    },
    {
      id: 4,
      type: "password",
      value: registerState.contra2.value,
      placeholder: "Repetición",
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
