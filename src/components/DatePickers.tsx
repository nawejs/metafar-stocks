// DatePickers.jsx
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePickers.css";
export const DatePickers = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  timeOption,
}: {
  startDate: Date;
  setStartDate: any;
  endDate: Date;
  setEndDate: any;
  timeOption: boolean;
}) => {
  return (
    <div className="datepicker-container">
      <div className="datepicker">
        <span>Desde: </span>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={60}
          dateFormat="yyyy-MM-dd"
          disabled={timeOption}
        />
      </div>
      <div className="datepicker">
        <span>Hasta: </span>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={60}
          dateFormat="yyyy-MM-dd"
          disabled={timeOption}
        />
      </div>
    </div>
  );
};
