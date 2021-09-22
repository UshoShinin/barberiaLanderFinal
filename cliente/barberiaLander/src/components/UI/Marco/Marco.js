import classes from "./Marco.module.css";
const Marco = (props) => {
  
  return (
    <>
    {props.use&&<div className={`${props.className!==undefined?props.className:''} ${classes.ajuste} ${props.logo!==undefined?classes.centrado:''}`}>
      {props.children}
    </div>}
    {!props.use&&<div className={`${props.className!==undefined?props.className:''}`}>
      {props.children}
    </div>}
    </>
  );
};
export default Marco;
