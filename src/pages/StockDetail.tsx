import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import StockChart from "../components/StockChart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AccionInterface, ChartInterface, ChartData } from "../interfaces";
import "./StockDetail.css";

const API_KEY = "b5bd66841a614a22a2ebfb610e4892d0";
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
  close: "",
  datetime: "",
  high: "",
  low: "",
  open: "",
  volume: "",
};

export default function StockDetail() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [stock, setStock] = useState<AccionInterface>(initialStockValue);

  const [chart, setChart] = useState<ChartData>({
    show: false,
    loading: false,
    error: false,
  });

  const [chartValues, setChartValues] = useState<ChartInterface[]>([
    initialChartValue,
  ]);
  const [chartInterval, setChartInterval] = useState<string>("1min");

  const { symbol, mic_code } = useParams();
  const [timeOption, setTimeOption] = useState<string>("realTime");

  const handleChangeTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeOption(event.target.value);
  };

  const handleChangeInterval = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setChartInterval(event.target.value);
  };

  const disabledButton = () => {
    const startDateWithoutTime = new Date();
    startDateWithoutTime.setHours(0, 0, 0, 0);

    if (chart.loading) {
      return true;
    }

    if (
      timeOption === "historicalTime" &&
      (+startDate >= +endDate || +startDate > +startDateWithoutTime)
    ) {
      return true;
    }
    return false;
  };

  const fetchChartStock = async () => {
    console.log("fetchChartStock", 1);
    try {
      // setChart({ ...chart, loading: true, error: false, show: false });
      setChart((prevChart) => ({
        ...prevChart,
        loading: true,
        error: false,
        show: false,
      }));
      console.log("fetchChartStock", 2);

      const apiUrl =
        timeOption === "historicalTime"
          ? `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${chartInterval}&start_date=${startDate}&end_date=${endDate}&apikey=${API_KEY}`
          : `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${chartInterval}&apikey=${API_KEY}`;

      const response = await fetch(apiUrl);
      const json = await response.json();
      const values = json.values.reverse();
      console.log("values", values);
      setChartValues(values);
      // setChart({ ...chart, show: true });
      setChart((prevChart) => ({
        ...prevChart,
        show: true,
      }));
    } catch (error) {
      console.log("fetchChartStock catch", "1 - 1");

      // setChart({
      //   ...chart,
      //   show: false,
      //   error: true,
      // });

      setChart((prevChart) => ({
        ...prevChart,
        show: false,
        error: true,
      }));

      console.log("chart", chart);
    } finally {
      console.log(chart);
      // setChart({ ...chart, loading: false });
      setChart((prevChart) => ({
        ...prevChart,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    const handleRealTimeUpdate = async () => {
      try {
        // setChart({ ...chart, loading: true, error: false, show: false });
        setChart((prevChart) => ({
          ...prevChart,
          loading: true,
          error: false,
          show: false,
        }));
        const apiUrl = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${chartInterval}&apikey=${API_KEY}`;
        const response = await fetch(apiUrl);
        const json = await response.json();
        const values = json.values.reverse();
        setChartValues(values);
        // setChart({ ...chart, show: true });
        setChart((prevChart) => ({ ...prevChart, show: true }));
      } catch (error) {
        // setChart({
        //   ...chart,
        //   show: false,
        //   error: true,
        // });

        setChart((prevChart) => ({ ...prevChart, show: false, error: true }));
      } finally {
        setChart((prevChart) => ({ ...prevChart, loading: false }));

        // setChart({ ...chart, loading: false });
      }
    };

    let intervalId: number;

    const handleClickGraficar = () => {
      // Detener cualquier intervalo existente antes de iniciar uno nuevo
      clearInterval(intervalId);

      if (timeOption === "realTime") {
        // Ejecutar la primera búsqueda y luego establecer el intervalo
        handleRealTimeUpdate();
        intervalId = setInterval(
          handleRealTimeUpdate,
          getMilliseconds(chartInterval)
        );
      }
    };

    const buttonElement = buttonRef.current;
    if (buttonElement) {
      buttonElement.addEventListener("click", handleClickGraficar);
    }

    return () => {
      if (buttonElement) {
        buttonElement.removeEventListener("click", handleClickGraficar);
      }

      // Limpiar el intervalo cuando el componente se desmonta
      clearInterval(intervalId);
    };
  }, [timeOption, chartInterval, symbol]);

  useEffect(() => {
    fetch(`${URL}&symbol=${symbol}&mic_code=${mic_code}`)
      .then((response) => response.json())
      .then((res) => setStock(res.data[0]));
  }, []);

  const getMilliseconds = (interval: string) => {
    // Mapear intervalos a milisegundos
    const intervalMap: Record<string, number> = {
      "1min": 60000,
      "5min": 300000,
      "15min": 900000,
    };

    return intervalMap[interval] || 60000;
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClickGraficar = () => {
    if (timeOption === "realTime") {
      fetchChartStock();
    } else {
      // Detener cualquier intervalo si se hizo clic en "Graficar" pero `timeOption` no es "realTime"
      clearInterval(intervalIDRef.current);
      fetchChartStock();
    }
  };

  const intervalIDRef = useRef<number | undefined>();

  return (
    <div style={{ width: "100%", height: "auto" }}>
      <div className="stock-detail">
        <div className="keys">
          <p>Name:</p>
          <p>Symbol:</p>
          <p>Currency:</p>
          <p>Mic Code:</p>
        </div>
        <div>
          <p>
            <b>{stock.name}</b>
          </p>
          <p>
            <b>{stock.symbol}</b>
          </p>
          <p>
            <b>{stock.currency}</b>
          </p>
          <p>
            <b>{stock.mic_code}</b>
          </p>
        </div>
      </div>

      <div className="radio-buttons">
        <label>
          <input
            type="radio"
            value="realTime"
            checked={timeOption === "realTime"}
            onChange={handleChangeTime}
          />
          <b>Tiempo Real</b> (Se grafica a partir de la fecha actual, se
          actualizará en base al intervalo)
        </label>

        <label>
          <input
            type="radio"
            value="historicalTime"
            checked={timeOption === "historicalTime"}
            onChange={handleChangeTime}
          />
          <b>Tiempo Histórico</b>
          <span> (La búsqueda debería comenzar desde ayer como mínimo)</span>
        </label>
      </div>

      <div>
        <div className="datepicker-date">
          <span>Desde: </span>
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={60}
            dateFormat="yyyy-MM-dd"
            // disabled={true}
          />
          <span>Hasta:</span>
          <DatePicker
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={60}
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div className="select-interval">
          <span>Intervalo</span>
          <select
            id="intervalo"
            value={chartInterval}
            onChange={handleChangeInterval}
          >
            <option value="1min">1 Minuto</option>
            <option value="5min">5 Minutos</option>
            <option value="15min">15 Minutos</option>
          </select>
        </div>
      </div>

      {/* GRAFICAR */}
      <div>
        <button
          onClick={handleClickGraficar}
          ref={buttonRef}
          disabled={disabledButton()}
        >
          Graficar
        </button>
      </div>
      <StockChart chartValues={chartValues} chart={chart} />
    </div>
  );
}
