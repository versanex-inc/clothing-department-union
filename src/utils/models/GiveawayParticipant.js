// models/GiveawayParticipant.js
import mongoose from "mongoose";

const giveawayParticipantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  socialId: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const GiveawayParticipant = mongoose.models.GiveawayParticipant || mongoose.model("GiveawayParticipant", giveawayParticipantSchema);

export default GiveawayParticipant;