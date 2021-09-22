import Item from "./Item";
import classes from "./Lista.module.css";
const Lista = (props) => {
  const content = props.items.map((item) => {
    let sel = props.selected!==undefined?props.selected:null;
    let active = sel!==null&&sel.id===item.id
      return (
        <Item
          active = {active}
          key={item.id}
          item={item}
          select={props.select}
        />
      );
  });
  return <ul className={`${classes.lista} ${props.className!==undefined?props.className:''}`}>{content}</ul>;
};
export default Lista;
