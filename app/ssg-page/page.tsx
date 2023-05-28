import { User } from "@/types/user";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SSRPage() {
  const users: User[] = await (
    await fetch("http://localhost:3000/api/users/getAllUsers", {
      method: "GET",
      cache: "force-cache"
    })
  ).json();

  if (!users) return notFound();

  return (
    <>
      <h2 className="text-2xl">Voir les profils de nos utilisateurs</h2>
      <nav>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/ssg-page/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </nav>
    </>
  );
}
