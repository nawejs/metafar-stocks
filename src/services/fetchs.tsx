export const fetchInicial = async () => {
  try {
    const response = await fetch(
      `https://api.twelvedata.com/stocks?source=docs&exchange=NYSE`
    );
    const json = await response.json();

    const stocks = json.data;

    return stocks;
  } catch (e) {
    throw new Error("Error searching Stocks");
  }
};
