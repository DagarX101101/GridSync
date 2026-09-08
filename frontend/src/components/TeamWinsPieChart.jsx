import React, { useState, useEffect } from "react";
import { useFilter } from "../context/FilterContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Typography, Paper, Box } from "@mui/material";
import f1Service from "../services/f1Service";
const TeamWinsPieChart = () => {
  const [constructors, setConstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { season } = useFilter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await f1Service.getConstructorsChampionship(season);
        setConstructors(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load team wins.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [season]);
  const chartData = constructors
    .filter((team) => team.wins > 0)
    .map((team, index) => ({
      name: team.teamId?.teamName,
      wins: team.wins,
      color: [
        "#E10600",
        "#1E5BC6",
        "#00D2BE",
        "#FFF200",
        "#FF8700",
        "#469BFF",
        "#9C27B0",
        "#4CAF50",
        "#795548",
        "#607D8B",
      ][index % 10],
    }));
  const totalWins = chartData.reduce(
    (sum, team) => sum + team.wins,
    0
  );
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.wins / totalWins) * 100).toFixed(1);
      return (
        <Paper sx={{ p: 1, bgcolor: "background.paper" }}>
          <Typography variant="body2">{`${data.name}: ${data.wins} wins`}</Typography>
          <Typography variant="body2">{`(${percentage}%)`}</Typography>
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
    <Box>
      <Typography variant="h6" gutterBottom>
        Team Total Wins Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="wins"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, wins }) => `${name}: ${wins}`}
            labelLine={true}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
            style={{ outline: "none" }}
          >
            {chartData.map((entry, index) => (
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
    </Box>
  );
};

export default TeamWinsPieChart;
