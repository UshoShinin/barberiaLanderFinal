const inputs = (state, dispatch) => {
    return [
      {
        id: 1,
        type: "number",
        value: state.Minutos.value,
        placeholder: "Minutos",
        onChange: (event) => {
          dispatch({
            type: "USER_MINUTOS",
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatch({ type: "BLUR_MINUTOS" });
        },
        onFocus: () => {
          dispatch({ type: "FOCUS_MINUTOS" });
        },
      }
    ];
  };
  
  export default inputs;
  