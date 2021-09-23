const inputs = (state, dispatch) => {
    return [
      {
        id: 1,
        type: "text",
        value: state.Producto.nombre.value,
        placeholder: "Nombre",
        onChange: (event) => {
          dispatch({
            type: "USER_P_NOMBRE",
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatch({ type: "BLUR_P_NOMBRE" });
        },
        onFocus: () => {
          dispatch({ type: "FOCUS_P_NOMBRE" });
        },
      },
      {
        id: 2,
        type: "text",
        value: state.Producto.price.value,
        placeholder: "Precio",
        onChange: (event) => {
          dispatch({
            type: "USER_P_PRICE",
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatch({ type: "BLUR_P_PRICE" });
        },
        onFocus: () => {
          dispatch({ type: "FOCUS_P_PRICE" });
        },
      },
      {
        id: 3,
        type: "text",
        value: state.Producto.stock.value,
        placeholder: "Stock",
        onChange: (event) => {
          dispatch({
            type: "USER_P_STOCK",
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatch({ type: "BLUR_P_STOCK" });
        },
        onFocus: () => {
          dispatch({ type: "FOCUS_P_STOCK" });
        },
      },
      {
        id: 4,
        type: "text",
        value: state.Agregar.stock.value,
        placeholder: "Stock",
        disabled:state.producto===null,
        onChange: (event) => {
          dispatch({
            type: "USER_A_STOCK",
            value: event.target.value,
          });
        },
        onBlur: () => {
          dispatch({ type: "BLUR_A_STOCK" });
        },
        onFocus: () => {
          dispatch({ type: "FOCUS_A_STOCK" });
        },
      },
      
    ];
  };
  
  export default inputs;
  