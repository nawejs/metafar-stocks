import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { AccionInterface } from "../interfaces";
// import debounce from "just-debounce-it";

// const API_KEY= "4c567f01c3a94d7f9a77816e6d48f43d"
// Primera Busqueda realizada === https://api.twelvedata.com/stocks?source=docs&amp;exchange=NYSE
// const cotizacionAccion = `https://api.twelvedata.com/time_series?symbol=TSLA&amp;interval=5min&amp;start_date=2021-04-16%2009:48:00&amp;end_date=2021-04-16%2019:48:00&amp;apikey=4c567f01c3a94d7f9a77816e6d48f43d`

function App() {
  const [stocks, setStocks] = useState<AccionInterface[]>([]);
  const [stockSymbol, setStockSymbol] = useState<string>("");
  const [stockName, setStockName] = useState<string>("");

  const searchStocks = async () => {
    const response = await fetch(
      "https://api.twelvedata.com/stocks?source=docs&exchange=NYSE"
    );
    const json = await response.json();
    setStocks(json.data);
  };

  useEffect(() => {
    searchStocks();
  }, []);

  // filtro el array de acciones por el nombre
  const filterStocks = () => {
    const results = stocks.filter((stock) => {
      return stock.name.toLowerCase().includes(stockName.toLowerCase());
    });
    return results;
  };

  // actualizo el nombre de la accion
  const handleChangeStock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStockName = e.target.value;
    setStockName(newStockName);
    filterStocks();
  };

  const handleChangeSymbol = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStockSymbol = e.target.value;
    setStockSymbol(newStockSymbol);
    // filterStocks();
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    fetch(`https://api.twelvedata.com/stocks?symbol=${stockSymbol}&source=docs`)
      .then((response) => response.json())
      .then((res) => setStocks(res.data))
      .catch((error) => console.log("error", error));
    setStockName("");
  };

  return (
    <div>
      <header>
        <form
          className="form"
          action=""
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "row" }}
        >
          <input
            name="stock"
            value={stockName}
            id="input-stock"
            placeholder="Tesla, Apple, Netflix ..."
            type="text"
            onChange={handleChangeStock}
          />
          <input
            name="symbol"
            value={stockSymbol}
            id="input-symbol"
            placeholder="Tsla, Aple, Nflx ..."
            type="text"
            onChange={handleChangeSymbol}
          />
          <button type="submit" disabled={!stockSymbol}>
            Buscar
          </button>
        </form>
      </header>
      <table>
        <tr>
          <td>Símbolo</td>
          <td>Nombre</td>
          <td>Moneda</td>
          <td>Tipo</td>
        </tr>
        {filterStocks() &&
          filterStocks().map((stock: AccionInterface) => (
            <tr key={`${stock.symbol}+${stock.mic_code}`}>
              <td>
                <Link to={`/stock-detail/${stock.symbol}/${stock.mic_code}`}>
                  {stock.symbol}
                </Link>
              </td>
              <td>{stock.name}</td>
              <td>{stock.currency}</td>
              <td>{stock.type}</td>
            </tr>
          ))}
      </table>
    </div>
  );
}

export default App;
