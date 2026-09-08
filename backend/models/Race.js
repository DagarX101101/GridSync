const mongoose = require("mongoose");

const raceSchema = new mongoose.Schema({
  season: Number,
  round: Number,
  raceName: String,
  circuitName: String,
  country: String,
  locality: String,
  date: String,
  time: String,
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
  },
  winningTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  laps: Number,
});

module.exports = mongoose.model("Race", raceSchema);