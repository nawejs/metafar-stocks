import { StockInterface } from "../interfaces";
import "./StockInfo.css";
export const StockInfo = ({ stock }: { stock: StockInterface }) => {
  return (
    <div className="stock-info">
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
  );
};
