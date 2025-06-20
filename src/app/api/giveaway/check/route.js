// app/api/giveaway/check/route.js
import { connectionStr } from "@/utils/db";
import GiveawayParticipant from "@/utils/models/GiveawayParticipant";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { phone, email, socialId } = await request.json();

  try {
    await connectionStr;
    const existing = await GiveawayParticipant.findOne({
      $or: [{ phone }, { email }, { socialId }],
      date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    return NextResponse.json({ exists: !!existing });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}