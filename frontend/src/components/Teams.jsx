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
} from "@mui/material";
import React, { useState, useEffect } from "react";
import f1Service from "../services/f1Service";
import { useFilter} from "../context/FilterContext";
const Teams = () => {
  const [constructors, setConstructors] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { season } = useFilter();
  useEffect(() => {
  const fetchData = async () => {
    try {
      const constructorsRes =
        await f1Service.getConstructorsChampionship(season);

      const driversRes =
        await f1Service.getDriversChampionship(season);

      setConstructors(constructorsRes.data);
      setDrivers(driversRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load team data.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [season]);
  // Group drivers by constructor
  const driversByConstructor = drivers.reduce((acc, driver) => {
  const team = driver.teamId?.teamName;

  if (!team) return acc;

  if (!acc[team]) {
    acc[team] = [];
  }

  acc[team].push(driver);

  return acc;
}, {});
if (loading) {
  return <Typography>Loading...</Typography>;
}
if (error) {
  return <Typography color="error">{error}</Typography>;
}
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        F1 Teams
      </Typography>

      {/* Teams Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {constructors.map((team) => (
  <Grid
    item
    xs={12}
    md={6}
    lg={4}
    key={team.teamId?._id || team.teamId?.teamId}
  >
            <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
              <Typography variant="h6" gutterBottom>
                {team.teamId?.teamName}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip label={team.teamId?.country} size="small" sx={{ mr: 1 }} />
                <Chip
                  label={`${team.wins} Wins`}
                  color="primary"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`${team.points} Points`}
                  color="secondary"
                  size="small"
                />
              </Box>

              {/* Team Drivers */}
              <Typography variant="subtitle2" gutterBottom>
                Current Drivers:
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Driver</TableCell>
                      <TableCell align="right">Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {driversByConstructor[team.teamId?.teamName]?.length ? (
                      driversByConstructor[team.teamId?.teamName].map((driver) => (
                        <TableRow key={driver.driverId?._id || driver.driverId?.driverId}>
                          <TableCell>
                            {driver.driverId?.name} {driver.driverId?.surname}
                          </TableCell>
                          <TableCell align="right">{driver.points}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          No drivers found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
                  </Grid>
))}
      </Grid>

      {/* Team Statistics Table */}
      <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
        <Typography variant="h6" gutterBottom>
          Team Statistics
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Team</TableCell>
                <TableCell>Nationality</TableCell>
                <TableCell align="right">Total Points</TableCell>
                <TableCell align="right">Total Wins</TableCell>
                <TableCell align="right">Current Drivers</TableCell>
                <TableCell align="right">Points per Win</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {constructors.map((team) => (
                <TableRow key={team.teamId?._id || team.teamId?.teamId}>
                  <TableCell>{team.teamId?.teamName}</TableCell>
                  <TableCell>{team.teamId?.country}</TableCell>
                  <TableCell align="right">
                    {team.points.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">{team.wins}</TableCell>
                  <TableCell align="right">
                    {driversByConstructor[team.teamId?.teamName]?.length || 0}
                  </TableCell>
                  <TableCell align="right">
                    {team.wins > 0
                    ? (team.points / team.wins).toFixed(1)
                    : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Teams;
