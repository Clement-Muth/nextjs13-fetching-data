import { get } from "@vercel/edge-config";
import { NextResponse } from "next/server";

export const GET = async () => {
  const users = await get("users");

  if (!users) return NextResponse.json(null, { status: 400 });

  return NextResponse.json(users);
};
