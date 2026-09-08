import React, { useEffect, useState } from "react";
import socket from "../services/socket";
import replayService from "../services/replayService";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Stack,
  Typography,
  Button,
  LinearProgress,
  Box,
} from "@mui/material";
const RaceReplay = () => {
    const [positions, setPositions] = useState([]);
    const [driverMap, setDriverMap] = useState({});
    useEffect(() => {
    const loadDrivers = async () => {
        try {
            const res = await fetch(
                "https://api.openf1.org/v1/drivers?session_key=9472"
            );

            const data = await res.json();

            const map = {};

            data.forEach(driver => {
                map[driver.driver_number] = driver;
            });

            setDriverMap(map);

        } catch (err) {
            console.error(err);
        }
    };

    loadDrivers();
}, []);
    useEffect(() => {
        socket.on("replay-update", (batch) => {
    setPositions((prev) => {
        const updated = [...prev];

        batch.forEach((driver) => {
            const index = updated.findIndex(
                (d) => d.driver_number === driver.driver_number
            );

            if (index >= 0) {
                updated[index] = driver;
            } else {
                updated.push(driver);
            }
        });

        updated.sort((a, b) => a.position - b.position);

        return updated;
    });
});

        return () => {
            socket.off("replay-update");
        };
    }, []);
    const handleStartReplay = async () => {
        try {
            const res = await replayService.startReplay();
            console.log(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
  <Box sx={{ p: 3 }}>

    <Typography variant="h4" gutterBottom>
      🏁 Bahrain Grand Prix Replay
    </Typography>

    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>

      <Button
        variant="contained"
        color="error"
        onClick={handleStartReplay}
      >
        ▶ Start Replay
      </Button>

      <Button variant="outlined">
        ⏸ Pause
      </Button>

      <Button variant="outlined">
        ↺ Restart
      </Button>

    </Stack>
    <Paper
    sx={{
        p:2,
        mb:3
    }}
>

<Typography variant="h6">

🔴 Live Replay

</Typography>

<Typography>

Streaming race data via Socket.IO

</Typography>

</Paper>

    <Typography sx={{ mb: 1 }}>
      Replay Progress
    </Typography>

    <LinearProgress
      variant="indeterminate"
      color="error"
      sx={{ mb: 3 }}
    />

    <Paper elevation={3}>

      <TableContainer
            sx={{
                maxHeight: 650
            }}
        >

        <Table stickyHeader>

          <TableHead>

            <TableRow>

              <TableCell>Pos</TableCell>

              <TableCell>Driver</TableCell>

              <TableCell>Team</TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {positions.map((driver) => {

              const info = driverMap[driver.driver_number];

              return (

                <TableRow
                    key={driver.driver_number}
                    sx={{
                        bgcolor:
                            driver.position === 1
                                ? "rgba(255,215,0,0.08)"
                                : "inherit",

                        transition: "all .3s"
                    }}
                >

                  <TableCell>

                    <Chip
                        label={`P${driver.position}`}
                        color={
                            driver.position === 1
                                ? "success"
                                : "error"
                        }
                    />

                  </TableCell>

                  <TableCell>

                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >

                      <Avatar
                            src={info?.headshot_url}
                            sx={{
                                width: 48,
                                height: 48
                            }}
                        />

                      <Box>

                        <Typography fontWeight="bold">

                          {info?.broadcast_name}

                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            #{driver.driver_number} • {info?.full_name}
                        </Typography>

                      </Box>

                    </Stack>

                  </TableCell>

                  <TableCell>

                    <Typography
                      fontWeight="bold"
                      sx={{
                        color:
                          "#" +
                          (info?.team_colour || "ffffff"),
                      }}
                    >

                      {info?.team_name}

                    </Typography>

                  </TableCell>

                </TableRow>

              );

            })}

          </TableBody>

        </Table>

      </TableContainer>

    </Paper>

  </Box>
);
};

export default RaceReplay;