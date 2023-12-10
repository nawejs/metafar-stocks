import { useEffect } from "react";
import { ChartData, ChartInterface } from "../interfaces";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StockChart = ({
  chartValues,
  chart,
}: {
  chartValues: ChartInterface[];
  chart: ChartData;
}) => {
  useEffect(() => {}, [chart]);

  if (chart.loading) {
    return <p>Cargando...</p>;
  }

  if (!chart.loading && chart.error) {
    return <p>No hay datos para mostrar. Intente actualizando las fechas</p>;
  }

  if (!chart.loading && !chart.error && chartValues[0]?.datetime) {
    return (
      <div style={{ height: "vh", width: "100%" }}>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={chartValues}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="datetime" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
};

export default StockChart;
