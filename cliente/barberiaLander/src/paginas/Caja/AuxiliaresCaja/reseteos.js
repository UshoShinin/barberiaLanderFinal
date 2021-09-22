export const resetAgendaProductos = () => {
  const agenda = document.getElementById("Agenda");
  if (
    agenda.classList[2] !== undefined &&
    agenda.classList[2].slice(7, 15) === "invalid2"
  )
    agenda.classList.remove(agenda.classList[2]);
  const productos = document.getElementById("Productos");
  if (
    productos.classList[3] !== undefined &&
    productos.classList[3].slice(7, 15) === "invalid2"
  )
    productos.classList.remove(productos.classList[3]);
};
