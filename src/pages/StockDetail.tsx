import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import StockChart from "../components/StockChart";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { AccionInterface, ChartInterface } from "../interfaces";

// URL https://api.twelvedata.com/stocks?source=docs&mic_code=XLIM&symbol=ATACOBC1

const API_KEY = "4c567f01c3a94d7f9a77816e6d48f43d";
const URL = "https://api.twelvedata.com/stocks?source=docs";
const initialStockValue = {
  symbol: "Loading",
  name: "Loading",
  currency: "Loading",
  exchange: "Loading",
  mic_code: "Loading",
  country: "Loading",
  type: "Loading",
};
const initialChartValue = {
  country: "",
  currency: "",
  exchange: "",
  mic_code: "",
  name: "",
  symbol: "",
  type: "",
};
export default function StockDetail() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [stock, setStock] = useState<AccionInterface>(initialStockValue);

  const [showChart, setShowChart] = useState(false);
  const [chartValues, setChartValues] = useState<ChartInterface[]>([
    initialChartValue,
  ]);

  const { symbol, mic_code } = useParams();

  useEffect(() => {
    fetch(`${URL}&symbol=${symbol}&mic_code=${mic_code}`)
      .then((response) => response.json())
      .then((res) => setStock(res.data[0]));
  }, []);

  const fetchChartStock = async () => {
    const response = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=5min&start_date=${startDate}&end_date=${endDate}&apikey=${API_KEY}`
    );
    const json = await response.json();
    const values = json.values;
    const sort = values.reverse();
    setChartValues(sort);
    setShowChart(true);

    // https://api.twelvedata.com/time_series?symbol=TSLA&interval=5min&start_date=2021-04-16%2009:48:00&end_date=2021-04-16%2019:48:00&apikey=*******
  };
  return (
    <div style={{ width: "800px", height: "800px" }}>
      <button>
        <Link to="/">Volver</Link>
      </button>
      <div>
        <p>Symbol {stock.symbol}</p>
        <p>Name {stock.name}</p>
        <p>Currency {stock.currency}</p>
        <p>Mic Code {stock.mic_code}</p>
      </div>
      <div>
        <span>Desde: </span>
        <DatePicker
          selected={startDate}
          onChange={(date: Date) => setStartDate(date)}
          showTimeSelect
          timeFormat="HH:mm:ss"
          timeIntervals={15}
          dateFormat="yyyy-MM-dd"
        />
        <span>Hasta:</span>
        <DatePicker
          selected={endDate}
          onChange={(date: Date) => setEndDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div>
        <button onClick={fetchChartStock}>Graficar</button>
        {showChart ? <StockChart chartValues={chartValues} /> : null}
      </div>
    </div>
  );
}
