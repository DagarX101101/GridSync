const axios = require("axios");
let replayEvents = [];
let replayIndex = 0;
let replayTimer = null;
exports.startReplay = async (req, res) => {
  try {
    const sessionKey = 9472;

    const response = await axios.get(
      `https://api.openf1.org/v1/position?session_key=${sessionKey}`
    );

    replayEvents = response.data;
    replayIndex = 0;
    const io = req.app.get("io");
    if (replayTimer) {
        clearInterval(replayTimer);
        replayTimer = null;
    }
    replayTimer = setInterval(() => {

        if (replayIndex >= replayEvents.length) {
            clearInterval(replayTimer);
            replayTimer = null;
            console.log("Replay Finished");
            return;
        }

        const currentTimestamp = replayEvents[replayIndex].date;

        const batch = [];

        while (
            replayIndex < replayEvents.length &&
            replayEvents[replayIndex].date === currentTimestamp
        ) {
            batch.push(replayEvents[replayIndex]);
            replayIndex++;
        }

        console.log(
            `Emitting ${batch.length} events for ${currentTimestamp}`
        );

        io.emit("replay-update", batch);

    }, 1000);


console.log(`Loaded ${replayEvents.length} events`);

    res.json({
    status: "success",
    message: "Replay Started",
    events: replayEvents.length,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};