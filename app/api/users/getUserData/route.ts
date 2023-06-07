import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();

  try {
    const users = [
      { name: "John", id: "john", age: 32, address: "Paris" },
      { name: "Alex", id: "alex", age: 31, address: "London" }
    ];

    if (!users) return NextResponse.json(null, { status: 400 });

    const user = users.find((user) => user.id === body.userId);

    if (user) return NextResponse.json(user);
    else return NextResponse.json(null, { status: 400 });
  } catch (_err) {
    return NextResponse.json(null, { status: 401 });
  }
};
