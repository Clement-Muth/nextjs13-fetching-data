export default async function Home() {
  const weather = await (
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=48.58363&lon=7.749753&appid=${process.env.API_KEY}`,
      {
        cache: "force-cache",
      }
    )
  ).json();

  return (
    <>
      <h1 className="text-4xl">Hello Clément</h1>
      <h2 className="text-2xl">
        Il fait {(Number(weather.main.feels_like) - 273, 15)}°C à {}
      </h2>
    </>
  );
}
