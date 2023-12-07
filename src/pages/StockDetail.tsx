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
// el chart deberia aparecer si show es true, el loading es true solo cuando se realiza el fetch, si da error

export default function StockDetail() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [stock, setStock] = useState<AccionInterface>(initialStockValue);

  const [chart, setChart] = useState({
    show: false,
    loading: false,
    error: false,
  });

  const [chartValues, setChartValues] = useState<ChartInterface[]>([
    initialChartValue,
  ]);

  const { symbol, mic_code } = useParams();

  const [interval, setInterval] = useState("1min");

  const [selectedOption, setSelectedOption] = useState("realTime");

  const handleChangeTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleChangeInterval = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setInterval(event.target.value);
  };

  useEffect(() => {
    fetch(`${URL}&symbol=${symbol}&mic_code=${mic_code}`)
      .then((response) => response.json())
      .then((res) => setStock(res.data[0]));
  }, []);

  // const fetchChartStock = async () => {
  //   await setChart({ ...chart, show: false });

  //   const response = await fetch(
  //     `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&start_date=${startDate}&end_date=${endDate}&apikey=${API_KEY}`
  //   );
  //   const json = await response.json();
  //   const values = json.values;
  //   const sort = await values.reverse();
  //   await setChartValues(sort);
  //   await setChart({ ...chart, show: true });

  //   // https://api.twelvedata.com/time_series?symbol=TSLA&interval=5min&start_date=2021-04-16%2009:48:00&end_date=2021-04-16%2019:48:00&apikey=*******
  // };
  const fetchChartStock = async () => {
    if (startDate === endDate) {
      console.log("las fechas son las mismas");
      return;
    }
    if (startDate > endDate) {
      console.log("La fecha de inicio es mayor a la de fin");
      return;
    }

    try {
      setChart({ ...chart, loading: true });
      const response = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&start_date=${startDate}&end_date=${endDate}&apikey=${API_KEY}`
      );
      const json = await response.json();
      const values = json.values;
      const sortValues = await values.reverse();
      setChartValues(sortValues);
      setChart({ ...chart, show: true });
    } catch (error) {
      setChart({ ...chart, error: true });
      console.log(error);
      // setError(error.message)
    } finally {
      setChart({ ...chart, loading: false, show: true });
    }
  };

  return (
    <div style={{ width: "100%", height: "auto" }}>
      <div>
        <button>
          <Link to="/">Volver</Link>
        </button>
      </div>
      <div className="radio-buttons">
        <label>
          <input
            type="radio"
            value="realTime"
            checked={selectedOption === "realTime"}
            onChange={handleChangeTime}
          />
          Tiempo Real (Se grafica apartir de la fecha actual, se actualizara en
          base al intervalo)
        </label>

        <label>
          <input
            type="radio"
            value="historicalTime"
            checked={selectedOption === "historicalTime"}
            onChange={handleChangeTime}
          />
          Tiempo Histórico
        </label>
        {/* <p>Seleccionado: {selectedOption}</p> */}
      </div>

      <div>
        <p>Symbol {stock.symbol}</p>
        <p>Name {stock.name}</p>
        <p>Currency {stock.currency}</p>
        <p>Mic Code {stock.mic_code}</p>
      </div>
      <div className="datepicker-date">
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
      <div className="select-interval">
        <span>Intervalo</span>
        <select id="intervalo" value={interval} onChange={handleChangeInterval}>
          <option value="1min">1 Minuto</option>
          <option value="5min">5 Minutos</option>
          <option value="15min">15 Minutos</option>
        </select>
      </div>
      <div>
        <button onClick={fetchChartStock}>Graficar</button>
        {chart.show ? (
          <StockChart chartValues={chartValues} />
        ) : (
          <code>{chart.error}</code>
        )}
      </div>
    </div>
  );
}
