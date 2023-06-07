import { NextResponse } from "next/server";

export const GET = () => {
  const users = [
    { name: "John", id: "john", age: 32, address: "Paris" },
    { name: "Alex", id: "alex", age: 31, address: "London" }
  ];

  if (!users) return NextResponse.json(null, { status: 400 });

  return NextResponse.json(users, { status: 200 });
};
