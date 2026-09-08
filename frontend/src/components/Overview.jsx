// spotify-dashboard/src/components/Overview.js
import { useFilter } from "../context/FilterContext";
import {
  Typography,
  Grid,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { performanceData } from "../data/f1Data";
import React, { useState, useEffect } from "react";
import f1Service from "../services/f1Service";
import TeamWinsPieChart from "./TeamWinsPieChart";
import QualifyingLapChart from "./QualifyingLapChart";
import { useTheme } from "@mui/material/styles";
import socket from "../services/socket";
console.log("socket =", socket);
const COLORS = [
  "#E10600",
  "#1E5BC6",
  "#00D2BE",
  "#FFF200",
  "#FF8700",
  "#469BFF",
];

const Overview = () => {
  const theme = useTheme();
  const { season } = useFilter();
  useEffect(() => {
  socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });

  return () => {
    socket.off("connect");
  };
}, []);
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
  try {
    const constructorsRes =
      await f1Service.getConstructorsChampionship(season);

    const driversRes =
      await f1Service.getDriversChampionship(season);

    console.log("Constructors:", constructorsRes);
    console.log("Drivers:", driversRes);

    setConstructors(constructorsRes.data);
    setDrivers(driversRes.data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
}, [season]);
if (loading) {
  return <Typography>Loading...</Typography>;
}
const totalPoints = constructors.reduce(
  (sum, c) => sum + Number(c.points),
  0
);

const totalWins = constructors.reduce(
  (sum, c) => sum + Number(c.wins),
  0
);

const totalTeams = constructors.length;

const totalDrivers = drivers.length;
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        F1 Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <Typography variant="h6">Points</Typography>
            <Typography variant="h3" color="primary">
              {totalPoints.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <Typography variant="h6">Fastest Lap Time</Typography>
            <Typography variant="h3" color="primary">
              00:00:55
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <Typography variant="h6">Teams</Typography>
            <Typography variant="h3" color="primary">
              {totalTeams.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <Typography variant="h6">Total Wins</Typography>
            <Typography variant="h3" color="primary">
              {totalWins.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Constructor Points */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <Typography variant="h6" gutterBottom>
              Constructor Total Points
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                  data={constructors.map((c) => ({
                      name: c.teamId?.teamName || "Unknown",
                      points: c.points,
                      wins: c.wins,
                  }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value}`, "Points"]}
                  labelFormatter={(label) => `Constructor: ${label}`}
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "4px",
                    boxShadow: theme.shadows[3],
                  }}
                  itemStyle={{
                    color: theme.palette.text.primary,
                    fontWeight: "bold",
                  }}
                  labelStyle={{
                    color: theme.palette.text.primary,
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                />
                <Legend />
                <Bar dataKey="points" fill="#E10600" name="Points" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Team Wins Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <TeamWinsPieChart />
          </Paper>
        </Grid>

        {/* Driver Performance Trends */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <Typography variant="h6" gutterBottom>
              Driver Performance Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" categories={performanceData.years} />
                <YAxis />
                <Tooltip />
                <Legend />
                {performanceData.data.map((driver, index) => (
                  <Line
                    key={driver.name}
                    type="monotone"
                    data={driver.data.map((value, i) => ({
                      year: performanceData.years[i],
                      value,
                    }))}
                    dataKey="value"
                    name={driver.name}
                    stroke={COLORS[index % COLORS.length]}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Qualifying Lap Times */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <QualifyingLapChart />
          </Paper>
        </Grid>
      </Grid>

      {/* Drivers Table */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <Typography variant="h6" gutterBottom>
              Driver Standings
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Surname</TableCell>
                    <TableCell>Nationality</TableCell>
                    <TableCell align="right">Points</TableCell>
                    <TableCell>Constructor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {drivers.map((driver) => (
                        <TableRow key={driver._id}>
                            <TableCell>{driver.driverId?.name}</TableCell>
                            <TableCell>{driver.driverId?.surname}</TableCell>
                            <TableCell>{driver.driverId?.nationality}</TableCell>
                            <TableCell align="right">{driver.points}</TableCell>
                            <TableCell>{driver.teamId?.teamName}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;
