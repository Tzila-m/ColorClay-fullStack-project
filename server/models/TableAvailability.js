const mongoose = require("mongoose");

const tableAvailabilitySchema = new mongoose.Schema({
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table", required: true
  },
  date: {
    type: Date,
    required: true
  },

  timeSlot: {
    type: String,
    enum: ["morning", "afternoon", "evening"],
    required: true
  },

});

module.exports = mongoose.model("TableAvailability", tableAvailabilitySchema);