const mongoose = require("mongoose");

const circuitSchema = new mongoose.Schema({
  circuitId: {
    type: String,
    required: true,
    unique: true,
  },
  circuitName: {
    type: String,
    required: true,
  },
  country: String,
  city: String,

  latitude: Number,
  longitude: Number,

  circuitLength: String,
  lapRecord: String,
  firstParticipationYear: Number,
  corners: Number,

  fastestLapDriverId: String,
  fastestLapTeamId: String,
  fastestLapYear: Number,

  url: String,
});

module.exports = mongoose.model("Circuit", circuitSchema);