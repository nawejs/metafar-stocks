import { useEffect, useState } from "react";
import "./StockPage.css";
import "../App.css";

import ListStocks from "../components/ListStocks";
import { AccionInterface } from "../interfaces";
import debounce from "just-debounce-it";
import { Link } from "react-router-dom";

function StocksPage() {
  const [stocks, setStocks] = useState<AccionInterface[]>([]);
  const [stockSymbol, setStockSymbol] = useState<string>("");
  const [stockName, setStockName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchInitialStocks();
  }, []);

  const debouncedFetchStocks = debounce((symbol: string) => {
    fetchStocks(symbol);
  }, 2000);

  const fetchInitialStocks = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.twelvedata.com/stocks?source=docs&exchange=NYSE"
      );
      const json = await response.json();
      setStocks(json.data);
    } catch (error) {
      console.error("Error fetching initial stocks:", error);
    } finally {
      setLoading(false); // Establecer loading a false después del fetch, ya sea éxito o error
    }
  };

  const fetchStocks = async (symbol: string) => {
    try {
      setLoading(true);
      const API_URL = symbol
        ? `https://api.twelvedata.com/stocks?symbol=${symbol}&source=docs`
        : "https://api.twelvedata.com/stocks?source=docs&exchange=NYSE";

      const response = await fetch(API_URL);
      const data = await response.json();
      setStocks(data.data);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    } finally {
      setLoading(false); // Establecer loading a false después del fetch, ya sea éxito o error
    }
  };

  const handleChangeStock = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStockName(e.target.value);
  };

  const handleChangeSymbol = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStockSymbol = e.target.value;
    setStockSymbol(e.target.value);
    if (!newStockSymbol) {
      fetchInitialStocks();
    } else {
      debouncedFetchStocks(newStockSymbol);
    }
  };

  // filtro el array de acciones por el nombre
  const filterStocks = stocks.filter((stock) =>
    stock.name.toLowerCase().includes(stockName.toLowerCase())
  );

  return (
    <div className="app-container">
      <header>
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="form-field">
            <legend>Busqueda por Nombre</legend>
            <label htmlFor="input-stock">Acción:</label>
            <input
              name="stock"
              value={stockName}
              id="input-stock"
              placeholder="Tesla, Apple, Netflix ..."
              type="text"
              onChange={handleChangeStock}
            />
          </fieldset>
          <fieldset className="form-field">
            <legend>Busqueda por Simbolo</legend>
            <label htmlFor="input-symbol">Símbolo:</label>
            <input
              name="symbol"
              value={stockSymbol}
              id="input-symbol"
              placeholder="TSLA, AAPL, NFLX ..."
              type="text"
              onChange={handleChangeSymbol}
            />
          </fieldset>
        </form>
      </header>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ListStocks
          filterStocks={filterStocks}
          symbol={stockSymbol}
          name={stockName}
        />
      )}
    </div>
  );
}

export default StocksPage;
