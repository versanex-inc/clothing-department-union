// app/api/giveaway/participants/route.js
import { connectionStr } from "@/utils/db";
import GiveawayParticipant from "@/utils/models/GiveawayParticipant";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectionStr;
    const participants = await GiveawayParticipant.find();
    return NextResponse.json(participants);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}