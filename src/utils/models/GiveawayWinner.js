// app/models/GiveawayWinner.js
import mongoose from "mongoose";

const giveawayWinnerSchema = new mongoose.Schema({
  socialId: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const GiveawayWinner = mongoose.models.GiveawayWinner || mongoose.model("GiveawayWinner", giveawayWinnerSchema);
export default GiveawayWinner;