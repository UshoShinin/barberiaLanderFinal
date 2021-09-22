export const initialState = {
    ciEmpleado : {value:'',isValid : null},
    ciCliente : {value:'',isValid : null},
    Mensaje : {show:false,value:''}
};

export const reducer = (state,action) =>{  
    switch(action.type){
        case "INPUT_CI_E":
            return {
            ...state,
            ciEmpleado: { value: action.value, isValid: state.ciEmpleado.isValid },
            };
        case "FOCUS_CI_E":
            return {
            ...state,
            ciEmpleado: {
                value: state.ciEmpleado.value,
                isValid: null,
            },
            };
        case "BLUR_CI_E":
            return {
            ...state,
            ciEmpleado: {
                value: state.ciEmpleado.value,
                isValid: state.ciEmpleado.value.trim().length>0,
            }
            };  
        case "INPUT_CI_C":
            return {
            ...state,
            ciCliente: { value: action.value, isValid: state.ciCliente.isValid },
            };  
        case "FOCUS_CI_C":
            return {
            ...state,
            ciCliente: {
                value: state.ciCliente.value,
                isValid: null,
            },
            };  
        case "BLUR_CI_C":
            return {
            ...state,
            ciCliente: {
                value: state.ciCliente.value,
                isValid: state.ciCliente.value.trim().length>0,
            }
        };
        case 'SHOW_MENSAJE':
            return {...state,Mensaje : {show:true,value:action.value}}
        case 'HIDE_MENSAJE':
            return {...state,Mensaje : {show:false,value:state.Mensaje.value}}
        default:
            return { ...state };
    }

}
