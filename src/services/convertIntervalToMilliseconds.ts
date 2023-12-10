export const convertIntervalToMilliseconds = (interval: string) => {
  switch (interval) {
    case "1min":
      return 60000; // 1 minuto
    case "5min":
      return 300000; // 5 minutos
    case "15min":
      return 900000; // 15 minutos
    default:
      return 60000; //   1 minuto
  }
};
