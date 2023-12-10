import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import StockChart from "../components/StockChart";
import { StockInterface, ChartInterface, ChartData } from "../interfaces";
import { StockInfo } from "../components/StockInfo";
import { RadioButtons } from "../components/RadioButtons";
import { DatePickers } from "../components/DatePickers";
import { SelectInterval } from "../components/SelectInterval";
import { getMilliseconds } from "../services/getMilliseconds";

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
  const [stock, setStock] = useState<StockInterface>(initialStockValue);

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
    try {
      setChart((prevChart) => ({
        ...prevChart,
        loading: true,
        error: false,
        show: false,
      }));

      const apiUrl =
        timeOption === "historicalTime"
          ? `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${chartInterval}&start_date=${startDate}&end_date=${endDate}&apikey=${API_KEY}`
          : `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${chartInterval}&apikey=${API_KEY}`;

      const response = await fetch(apiUrl);
      const json = await response.json();
      // Los datos llegan al reves
      const values = json.values.reverse();
      setChartValues(values);
      setChart((prevChart) => ({
        ...prevChart,
        show: true,
      }));
    } catch (error) {
      setChart((prevChart) => ({
        ...prevChart,
        show: false,
        error: true,
      }));
    } finally {
      setChart((prevChart) => ({
        ...prevChart,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    const handleRealTimeUpdate = async () => {
      try {
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
        setChart((prevChart) => ({ ...prevChart, show: true }));
      } catch (error) {
        setChart((prevChart) => ({ ...prevChart, show: false, error: true }));
      } finally {
        setChart((prevChart) => ({ ...prevChart, loading: false }));
      }
    };

    let intervalId: number;

    const handleClickGraficar = () => {
      // Detener cualquier intervalo antes de iniciar uno nuevo
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
  }, [timeOption, chartInterval]);

  useEffect(() => {
    fetch(`${URL}&symbol=${symbol}&mic_code=${mic_code}`)
      .then((response) => response.json())
      .then((res) => setStock(res.data[0]));
  }, []);

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
      <StockInfo stock={stock} />

      <RadioButtons
        timeOption={timeOption}
        handleChangeTime={handleChangeTime}
      />
      <div>
        <DatePickers
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          timeOption={timeOption === "realTime"}
        />
        <SelectInterval
          chartInterval={chartInterval}
          handleChangeInterval={handleChangeInterval}
        />
      </div>

      {/* GRAFICAR */}
      <div style={{ marginBottom: "10px" }}>
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
