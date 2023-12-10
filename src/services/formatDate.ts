// const fechaString = "Wed Dec 06 2023 19:27:40 GMT-0300 (Argentina Standard Time)";
// const fecha = new Date(fechaString);

export const formatDate = (date: Date) => {
  // Obtener componentes de la fecha
  const año = date.getFullYear();
  const mes = (date.getMonth() + 1).toString().padStart(2, "0"); // El mes es 0-indexado
  const día = date.getDate().toString().padStart(2, "0");

  // Construir la cadena de fecha en formato "yyyy-mm-dd"
  const newDate = `${año}-${mes}-${día}`;
  console.log("Fecha formateada:", newDate);
  return `${año}-${mes}-${día}`;
};
