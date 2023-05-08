import { notFound } from "next/navigation";

export default async function Home({ params: { userId } }: any) {
  fetch("", { cache: "force-cache" });
  if (userId !== "romanie" && userId !== "clement") return notFound();

  return (
    <>
      <h1 className="text-4xl">Hello {userId}</h1>{" "}
    </>
  );
}

export async function generateStaticParams() {
  return [{ userId: "clement" }, { userId: "romanie" }];
}
