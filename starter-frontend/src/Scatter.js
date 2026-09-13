import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Label,
} from "recharts";
import { useState } from "react";

function calculateCorrelation(data) {
  if (!data || data.length < 2) return 0;

  const x = data.map((point) => point.x);
  const y = data.map((point) => point.y);

  const meanX = x.reduce((sum, value) => sum + value, 0) / x.length;
  const meanY = y.reduce((sum, value) => sum + value, 0) / y.length;

  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;

  for (let i = 0; i < x.length; i++) {
    const xDiff = x[i] - meanX;
    const yDiff = y[i] - meanY;

    numerator += xDiff * yDiff;
    denominatorX += xDiff ** 2;
    denominatorY += yDiff ** 2;
  }

  const denominator = Math.sqrt(denominatorX * denominatorY);
  if (!denominator) return 0;

  return numerator / denominator;
}

export default function RecipeScatterPlot({ recipes }) {
  const variables = {
    dose_grams: "Dose (g)",
    yield_grams: "Yield (g)",
    time_seconds: "Brew Time (s)",
    temp_setting: "Temperature (°C)",
    grind_setting: "Grind Setting",
    rating: "Rating",
    days_since_roastdate: "Days Since Roast",
  };

  const [xVariable, setXVariable] = useState("dose_grams");
  const [yVariable, setYVariable] = useState("rating");

  const data = recipes.map((recipe) => ({
    x: Number(recipe[xVariable]),
    y: Number(recipe[yVariable]),
  }));

  const correlation = calculateCorrelation(data);
  const strength =
    Math.abs(correlation) >= 0.9
      ? "Very Strong"
      : Math.abs(correlation) >= 0.7
      ? "Strong"
      : Math.abs(correlation) >= 0.5
      ? "Moderate"
      : "Low";

  const xMax = Math.max(...data.map((point) => point.x), 20);
  const yMax = Math.max(...data.map((point) => point.y), 10);
  const xDomain = [0, Math.ceil(xMax / 5) * 5];
  const yDomain = [0, Math.ceil(yMax / 2) * 2];

  const xLabel = variables[xVariable];
  const yLabel = variables[yVariable];

  return (
    <div className="scatter-shell">
      <div className="scatter-topbar">
      </div>

      <div className="scatter-axis-row">
        <div className="scatter-axis-box">
          <span className="scatter-axis-title">X AXIS</span>
          <select
            className="scatter-select"
            name="x_axis"
            value={xVariable}
            onChange={(e) => setXVariable(e.target.value)}
          >
            <option value="dose_grams">Dose (g)</option>
            <option value="yield_grams">Yield (g)</option>
            <option value="time_seconds">Brew Time (s)</option>
            <option value="temp_setting">Temperature (°C)</option>
            <option value="grind_setting">Grind Setting</option>
            <option value="days_since_roastdate">Days Since Roast</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        <span className="scatter-vs-pill">VS</span>

        <div className="scatter-axis-box">
          <span className="scatter-axis-title">Y AXIS</span>
          <select
            className="scatter-select"
            name="y_axis"
            value={yVariable}
            onChange={(e) => setYVariable(e.target.value)}
          >
            <option value="rating">Rating</option>
            <option value="dose_grams">Dose (g)</option>
            <option value="yield_grams">Yield (g)</option>
            <option value="time_seconds">Brew Time (s)</option>
            <option value="temp_setting">Temperature (°C)</option>
            <option value="grind_setting">Grind Setting</option>
            <option value="days_since_roastdate">Days Since Roast</option>
          </select>
        </div>
      </div>

      <div className="scatter-chart-panel">
        <ResponsiveContainer width="100%" height={340}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 24, left: 18 }}>
            <CartesianGrid
              stroke="#d9cfc5"
              strokeDasharray="5 5"
              vertical={true}
              horizontal={true}
            />

            <XAxis
              type="number"
              dataKey="x"
              domain={xDomain}
              tickCount={5}
              tick={{ fill: "#5e483f", fontSize: 13, fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: "#4d3a32", strokeWidth: 1.5 }}
              label={{
                value: xLabel,
                position: "insideBottom",
                offset: -4,
                fill: "#43352f",
                fontSize: 14,
                fontWeight: 700,
              }}
            />

            <YAxis
              type="number"
              dataKey="y"
              domain={yDomain}
              tickCount={5}
              tick={{ fill: "#5e483f", fontSize: 13, fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: "#4d3a32", strokeWidth: 1.5 }}
              label={{
                value: yLabel,
                angle: -90,
                position: "insideLeft",
                fill: "#43352f",
                fontSize: 14,
                fontWeight: 700,
              }}
            />

            <Scatter
              data={data}
              fill="#5e4438"
              line
              lineType="joint"
              shape={(props) => {
                const { cx, cy } = props;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="#5e4438"
                    stroke="#f4efe9"
                    strokeWidth={3}
                  />
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>

        <div className="scatter-annotation">
          <span className="scatter-bullet" />
          <span>Tasting Logs (N={recipes.length || 0})</span>
          <span className="scatter-avg">
            {data.length ? `${data[0]?.x ?? 0}g • ${data[0]?.y ?? 0}°C` : "0g • 0°C"}
          </span>
        </div>
      </div>

      <div className="pearson-card">
        <div className="pearson-card-header">
          <span>PEARSON COEFFICIENT</span>
          <span className="pearson-strength">★ {strength}</span>
        </div>

        <div className="pearson-score">
          R = <span>{Math.abs(correlation).toFixed(5)}</span>
        </div>

      </div>
    </div>
  );
}
