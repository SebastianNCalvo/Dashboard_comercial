export const generarCodigoVenta = () => {
    const fecha = new Date();
    const diaMes = `${fecha.getDate()}${fecha.getMonth() + 1}`;
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `MB-${diaMes}-${randomStr}`;
  };