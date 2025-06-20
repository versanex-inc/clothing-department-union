// app/api/giveawaylock/route.js
import { connectionStr } from "@/utils/db";
import GiveawayLock from "@/utils/models/GiveawayLock";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectionStr;
    const lock = await GiveawayLock.findOne() || (await new GiveawayLock().save());
    return NextResponse.json({ isLocked: lock.isLocked });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const { isLocked } = await request.json();
  try {
    await connectionStr;
    const lock = await GiveawayLock.findOne() || new GiveawayLock();
    lock.isLocked = isLocked;
    await lock.save();
    return NextResponse.json({ success: true, isLocked });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}