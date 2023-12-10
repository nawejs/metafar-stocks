export const getMilliseconds = (interval: string) => {
  const intervalMap: Record<string, number> = {
    "1min": 60000,
    "5min": 300000,
    "15min": 900000,
  };

  return intervalMap[interval] || 60000;
};
