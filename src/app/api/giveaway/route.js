// app/api/giveaway/route.js
import { connectionStr } from "@/utils/db";
import GiveawayParticipant from "@/utils/models/GiveawayParticipant";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { name, phone, address, email, socialId } = await request.json();

  if (!name || !phone.replace("92 ", "").trim() || !address || !email || !socialId.trim()) {
    return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });
  }

  try {
    await connectionStr;
    const existing = await GiveawayParticipant.findOne({
      $or: [{ phone }, { email }, { socialId }],
      date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    if (existing) {
      return NextResponse.json({ success: false, exists: true });
    }

    const newParticipant = new GiveawayParticipant({
      name,
      phone: phone.replace("92 ", ""),
      address,
      email,
      socialId,
    });
    await newParticipant.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectionStr;
    const participants = await GiveawayParticipant.find();
    return NextResponse.json(participants);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}