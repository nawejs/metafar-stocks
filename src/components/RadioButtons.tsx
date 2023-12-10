import "./RadioButtons.css";
export const RadioButtons = ({
  timeOption,
  handleChangeTime,
}: {
  timeOption: string;
  handleChangeTime: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
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
  );
};
