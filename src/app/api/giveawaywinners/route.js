// app/api/giveawaywinners/route.js
import { connectionStr } from "@/utils/db";
import GiveawayWinner from "@/utils/models/GiveawayWinner";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectionStr;
    const winners = await GiveawayWinner.find().sort({ date: -1 }).limit(5); // Last 5 winners
    return NextResponse.json(winners);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const { socialId } = await request.json();

  try {
    await connectionStr;
    const newWinner = new GiveawayWinner({ socialId });
    await newWinner.save();
    return NextResponse.json({ success: true, winner: newWinner });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}