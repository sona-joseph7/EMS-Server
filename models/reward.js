const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  reward: {
    type: String,
    required: true,
  },
});

const Reward = mongoose.model("Reward", rewardSchema);
module.exports = Reward;
