// app/models/GiveawayLock.js
import mongoose from "mongoose";

const giveawayLockSchema = new mongoose.Schema({
  isLocked: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

const GiveawayLock = mongoose.models.GiveawayLock || mongoose.model("GiveawayLock", giveawayLockSchema);
export default GiveawayLock;