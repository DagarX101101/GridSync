import React, { useState, useEffect } from "react";
import { useFilter } from "../context/FilterContext";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import f1Service from "../services/f1Service";
import QualifyingLapChart from "./QualifyingLapChart";

// Mock data for races (you can replace this with real data)


const Races = () => {
  const [races, setRaces] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const { season } = useFilter();
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  useEffect(() => {
  const fetchData = async () => {
    try {
      const racesRes = await f1Service.getRaces(season);
      const driversRes = await f1Service.getDriversChampionship(season);
      const constructorsRes =
        await f1Service.getConstructorsChampionship(season);

      setRaces(racesRes.data);
      setDrivers(driversRes.data);
      setConstructors(constructorsRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load race data.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [season]);
  const totalRaces = races.length;
  const constructorStats = constructors.map((team) => ({
    ...team,
    winRate:
  totalRaces > 0
    ? ((team.wins / totalRaces) * 100).toFixed(1)
    : 0,
    avgPoints:
  totalRaces > 0
    ? (team.points / totalRaces).toFixed(1)
    : 0,
  }));

  const completedRaces = races.filter(
    (race) => new Date(race.date) < new Date()
  ).length;

  const upcomingRaces = totalRaces - completedRaces;

  const averageLaps =
    totalRaces > 0
      ? (
          races.reduce((sum, race) => sum + race.laps, 0) / totalRaces
        ).toFixed(1)
      : 0;

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        F1 Races
      </Typography>

      {/* Race Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <Typography variant="h6">Total Races</Typography>
            <Typography variant="h3" color="primary">
              {totalRaces}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <Typography variant="h6">Races This Season</Typography>
            <Typography variant="h3" color="primary">
              {completedRaces}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <Typography variant="h6">Upcoming Races</Typography>
            <Typography variant="h3" color="primary">
              {upcomingRaces}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <Typography variant="h6">Average Laps</Typography>
            <Typography variant="h3" color="primary">
              {averageLaps} Laps
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs for different race views */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Race Calendar" />
          <Tab label="Race Results" />
          <Tab label="Race Statistics" />
          <Tab label="Race Analysis" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
          <Typography variant="h6" gutterBottom>
            Race Calendar
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Race</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Circuit</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {races.map((race) => (
                  <TableRow key={race._id}>
                    <TableCell>{race.raceName}</TableCell>

                    <TableCell>
                      {new Date(race.date).toLocaleDateString()}
                    </TableCell>

                    <TableCell>{race.country}</TableCell>

                    <TableCell>{race.circuitName}</TableCell>

                    <TableCell>
                      <Chip
                        label="Completed"
                        color="success"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {selectedTab === 1 && (
        <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
          <Typography variant="h6" gutterBottom>
            Latest Race Results
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Position</TableCell>
                  <TableCell>Driver</TableCell>
                  <TableCell>Team</TableCell>
                  <TableCell align="right">Points</TableCell>
                  <TableCell>Time/Gap</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {drivers.map((driver, index) => (
                  <TableRow key={driver._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {driver.driverId?.name} {driver.driverId?.surname}
                    </TableCell>
                    <TableCell>{driver.teamId?.teamName}</TableCell>
                    <TableCell align="right">{driver.points}</TableCell>
                    <TableCell>+{index * 5}s</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
              <Typography variant="h6" gutterBottom>
                Team Performance in Races
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={constructors.map((team) => ({
                    name: team.teamId?.teamName,
                    points: team.points,
                    wins: team.wins,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="points"
                    stroke="#E10600"
                    name="Points"
                  />
                  <Line
                    type="monotone"
                    dataKey="wins"
                    stroke="#00D2BE"
                    name="Wins"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
              <Typography variant="h6" gutterBottom>
                Race Statistics
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Team</TableCell>
                      <TableCell align="right">Win Rate</TableCell>
                      <TableCell align="right">Avg Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {constructorStats.map((team) => (
                      <TableRow key={team._id}>
                        <TableCell>{team.teamId?.teamName}</TableCell>
                        <TableCell align="right">
                          {team.winRate}%
                        </TableCell>
                        <TableCell align="right">
                          {team.avgPoints}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {selectedTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
              <QualifyingLapChart />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Races;
