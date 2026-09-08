import React, { useState, useEffect } from "react";
import { Typography, Paper } from "@mui/material";
import { useFilter } from "../context/FilterContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import f1Service from "../services/f1Service";
const QualifyingLapChart = () => {
  const [laps, setLaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { season } = useFilter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await f1Service.getPracticeSession(season, 1, "fp1");
        setLaps(res.data);
      } catch (err) {
        console.error(err);
        setError("Practice session data is not available for this season.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [season]);
  // Convert lap times to seconds for easier comparison
  const convertTimeToSeconds = (timeStr) => {
    const [minutes, seconds] = timeStr.split(":");
    return Number(minutes) * 60 + Number(seconds);
  };

  const data = laps
  .slice(0, 5)
  .map((lap, index) => ({
    name: `${lap.driverId?.name} ${lap.driverId?.surname}`,
    value: convertTimeToSeconds(lap.time),
    team: lap.teamId?.teamName,
    color: [
      "#0600EF",
      "#DC0000",
      "#00D2BE",
      "#FF8700",
      "#469BFF",
    ][index % 5],
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const minutes = Math.floor(data.value / 60);
      const seconds = (data.value % 60).toFixed(3);
      return (
        <Paper sx={{ p: 1, bgcolor: "background.paper" }}>
          <Typography variant="body2">{data.name}</Typography>
          <Typography variant="body2">{data.team}</Typography>
          <Typography variant="body2">
            Lap Time: {minutes}:{seconds}
          </Typography>
        </Paper>
      );
    }
    return null;
  };
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  return (
    <>
      <Typography variant="h6" gutterBottom>
        FP1 Lap Times
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={120}
            paddingAngle={5}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
            style={{ outline: "none" }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                style={{ outline: "none" }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default QualifyingLapChart;
