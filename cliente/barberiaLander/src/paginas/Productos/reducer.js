import { validarMonto } from "../../FuncionesAuxiliares/FuncionesAuxiliares";
export const initialState = {
    productos: null,
    productosDiscontinuados: null,
    producto: null,
    Producto:{
        nombre:{value:'',isValid:null},
        price:{value:'',isValid:null},
        stock:{value:'',isValid:null},
        discontinuado:false,
        problema: -1,
        problemas: [
            { id: 1, pro: "" },
            { id: 2, pro: "" },
            { id: 3, pro: "" },
            { id: 4, pro: "" },
        ],
    },
    Agregar:{
        stock:{value:'',isValid:null},
        problema: '',
    },
    Mensaje: { show: false, text: "" }
  };
  
const ordenar = (a, b) => {
return a.id - b.id;
};

export const reducer = (state, action) => {
    let valido = false;
    let problemasAux;
    let problem = -1;
    let nombre;
    let pro=[];
    let dis=[];
    switch (action.type) {
        case "CARGAR":
            let data = {}
            action.payload.forEach(P => {
                if(!P.discontinuado) pro.push(P);
                else dis.push(P);
            });
            if(action.datos!==undefined){
                data = {...action.datos};
            }
            return { ...state,...data, productos: [...pro],productosDiscontinuados:[...dis]};
        case "CLICK": 
            let nuevoPoducto = state.producto!==null&&state.producto.id===action.value.id?null:action.value

            if (nuevoPoducto!==null){
                return {...state,producto:nuevoPoducto,Producto:{
                    ...initialState.Producto,
                    nombre:{value:String(nuevoPoducto.nombre),isValid:true},
                    price:{value:String(nuevoPoducto.price),isValid:true},
                    stock:{value:String(nuevoPoducto.stock),isValid:true},
                    discontinuado:nuevoPoducto.discontinuado,
                } };
            }
            else return {...state,producto:nuevoPoducto,Producto:{...initialState.Producto},Agregar:{...initialState.Agregar} };
            
        case "USER_P_NOMBRE":
            return {
                ...state,
                Producto:{...state.Producto,nombre:{...state.Producto.nombre,value:action.value}},
            };
        case "FOCUS_P_NOMBRE":
            return {
                ...state,
                Producto:{...state.Producto,nombre:{...state.Producto.nombre,isValid:null}},
            };
        case "BLUR_P_NOMBRE":
            nombre = state.Producto.nombre.value.trim().length
            valido = nombre>0&&nombre<26;
            problemasAux = state.Producto.problemas.filter((p) => p.id !== 1);
            if (!valido)
                problemasAux = [
                ...problemasAux,
                {
                    id: 1,
                    pro: "El nombre del producto debe tener minimo 1 caracter y máximo 25",
                },
                ];
            else problemasAux = [...problemasAux, { id: 1, pro: "" }];
            problemasAux.sort(ordenar);
            for (let i = 0; i < state.Producto.problemas.length; i++) {
                if (problemasAux[i].pro !== "") {
                problem = i;
                break;
                }
            }
            return {
                ...state,
                Producto:{
                    ...state.Producto,
                    nombre:{...state.Producto.nombre,isValid:valido},
                    problemas: [...problemasAux],
                    problema: problem,
                },
            };
        case "USER_P_PRICE":
            return {
                ...state,
                Producto:{...state.Producto,price:{...state.Producto.price,value:action.value}},
            };
        case "FOCUS_P_PRICE":
            return {
                ...state,
                Producto:{...state.Producto,price:{...state.Producto.price,isValid:null}},
            };
        case "BLUR_P_PRICE":
            valido = validarMonto(state.Producto.price.value);
            problemasAux = state.Producto.problemas.filter((p) => p.id !== 2);
            if (!valido)
                problemasAux = [
                ...problemasAux,
                {
                    id: 2,
                    pro: "El precio debe ser un número entero positivo de máximo 6 carácteres",
                },
                ];
            else problemasAux = [...problemasAux, { id: 2, pro: "" }];
            problemasAux.sort(ordenar);
            for (let i = 0; i < state.Producto.problemas.length; i++) {
                if (problemasAux[i].pro !== "") {
                problem = i;
                break;
                }
            }
            return {
                ...state,
                Producto:{
                    ...state.Producto,
                    price:{...state.Producto.price,isValid:valido},
                    problemas: [...problemasAux],
                    problema: problem,
                },
            };

        case "USER_P_STOCK":
            return {
                ...state,
                Producto:{...state.Producto,stock:{...state.Producto.stock,value:action.value}},
            };
        case "FOCUS_P_STOCK":
            return {
                ...state,
                Producto:{...state.Producto,stock:{...state.Producto.stock,isValid:null}},
            };
        case "BLUR_P_STOCK":
            valido = validarMonto(state.Producto.stock.value);
            problemasAux = state.Producto.problemas.filter((p) => p.id !== 3);
            if (!valido)
                problemasAux = [
                ...problemasAux,
                {
                    id: 3,
                    pro: "El stock debe ser un número entero positivo de máximo 6 carácteres",
                },
                ];
            else problemasAux = [...problemasAux, { id: 3, pro: "" }];
            problemasAux.sort(ordenar);
            for (let i = 0; i < state.Producto.problemas.length; i++) {
                if (problemasAux[i].pro !== "") {
                problem = i;
                break;
                }
            }
            return {
                ...state,
                Producto:{
                    ...state.Producto,
                    stock:{...state.Producto.stock,isValid:valido},
                    problemas: [...problemasAux],
                    problema: problem,
                },
            };

        case 'CHECK':
            return {...state,Producto:{...state.Producto,discontinuado:!state.Producto.discontinuado}}

        case "USER_A_STOCK":
            return {
                ...state,
                Agregar:{...state.Agregar,stock:{...state.Agregar.stock,value:action.value}},
            };
        case "FOCUS_A_STOCK":
            return {
                ...state,
                Agregar:{...state.Agregar,stock:{...state.Agregar.stock,isValid:null}},
            };
        case "BLUR_A_STOCK":
            valido = validarMonto(state.Agregar.stock.value);
            return {
                ...state,
                Agregar:{...state.Agregar,stock:{...state.Agregar.stock,isValid:valido},problema:!valido?'El stock debe ser un número entero positivo de máximo 6 carácteres':''},
            };
        case "ERROR_A_STOCK":
            return {
                ...state,
                Agregar:{...state.Agregar,problema:action.value},
            };
        case "SHOW_MENSAJE":
            return { ...state, Mensaje: { show: true, text: action.value } };
        case "HIDE_MENSAJE":
            return { ...state, Mensaje: { ...state.Mensaje, show: false } };
        default:
            return {...state}
    }
};