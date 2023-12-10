export const SelectInterval = ({
  chartInterval,
  handleChangeInterval,
}: {
  chartInterval: string;
  handleChangeInterval: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <div className="select-interval" style={{ marginBottom: "20px" }}>
      <span>Intervalo </span>
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
  );
};
