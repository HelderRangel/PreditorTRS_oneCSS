import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

export function GaugeTRS({ valor = 0 }: { valor: number }) {
  const data = [
    {
      name: "TRS",
      value: valor,
      fill: valor > 70 ? "#ff4d4f" : valor > 50 ? "#faad14" : "#52c41a",
    },
  ];

  return (
    <ResponsiveContainer width="100%" height="90%">
      <RadialBarChart
        cx="50%"
        cy="65%"
        innerRadius="100%"
        outerRadius="80%"
        barSize={40}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar dataKey="value" background />
        <text
          x="50%"
          y="63%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={22}
          fontWeight="bold"
          fill="#333"
        >
          {valor.toFixed(2)}%
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
