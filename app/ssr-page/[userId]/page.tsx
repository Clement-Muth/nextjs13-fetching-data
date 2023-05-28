import { notFound } from "next/navigation";

export default async function UserPage({ params: { userId } }: { params: { userId: string } }) {
  const user = await (
    await fetch("http://localhost:3000/api/users/getUserData", {
      method: "POST",
      body: JSON.stringify({ userId }),
      cache: "no-store"
    })
  ).json();

  if (!user) return notFound();

  return (
    <>
      <h1 className="text-4xl">
        Hello {user.name}, tu as {user.age} ans et tu vis à l&apos;adresse {user.address}
      </h1>
    </>
  );
}
