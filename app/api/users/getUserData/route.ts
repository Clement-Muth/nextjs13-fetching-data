import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

type User = {
  id: string;
  name: string;
  age: number;
  address: string;
};

export const POST = async (req: Request) => {
  const body = await req.json();

  try {
    const users: User[] | undefined = await get(`users`);

    if (!users) return NextResponse.json(null, { status: 400 });

    if (users.find((user) => user.id === body.userId))
      return NextResponse.json(users.find((user) => user.id === body.userId));
    else
      return NextResponse.json(null, { status: 400 });
  } catch (err) {
    return NextResponse.json(null, { status: 401 });
  }
};
