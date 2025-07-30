import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface TrendItem {
  Timestamp: string;
  Value: number;
  PreditorTRS: number;
  Metanol: number;
  Oxigenio: number;
  Temperatura: number;
  CO: number;
  GAS: number;
  LAMA: number;
}

interface TrendChartProps {
  data: TrendItem[];
}

export function TrendChart({ data }: TrendChartProps) {
  const formattedData = data.map((item) => ({
    name: new Date(item.Timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    fullDate: new Date(item.Timestamp),
    value: item.Value,
    pred: item.PreditorTRS,
    metanol: item.Metanol,
    oxigenio: item.Oxigenio,
    temperatura: item.Temperatura,
    co: item.CO,
    gas: item.GAS,
    lama: item.LAMA,
  }));

  return (
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Legend />
        <Tooltip />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="value"
          stroke="#89CFF0"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="pred"
          stroke="#FFD6A5"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
