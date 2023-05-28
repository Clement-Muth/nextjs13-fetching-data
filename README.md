## Static Data Fetching

By default, **`fetch`** will automatically fetch and [cache data](https://nextjs.org/docs/app/building-your-application/data-fetching/caching) indefinitely.

```js
fetch('https://...'); // cache: 'force-cache' is the default
```

### Revalidating Data

To revalidate [cached data](https://nextjs.org/docs/app/building-your-application/data-fetching/caching) at a timed interval, you can use the **`next.revalidate`** option in **`fetch()`** to set the **`cache`** lifetime of a resource (in seconds).

```js
fetch('https://...', { next: { revalidate: 10 } });
```

See [Revalidating Data](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating) for more information.

```txt
**NOTE:** Caching at the fetch level via revalidate or cache: 'force-cache' stores the data across requests in a shared cache. You should avoid using it for user-specific data (i.e. requests that derive data from cookies() or headers())
```

## Dynamic Data Fetching

To fetch fresh data on every **`fetch`** request, use the **`cache: 'no-store'`** option.

```js
fetch('https://...', { cache: 'no-store' });
```

## Data Fetching Patterns

### Parallel Data Fetching

To minimize client-server waterfalls, we recommend this pattern to fetch data in parallel:

```ts
import Albums from './albums';
 
async function getArtist(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}`);
  return res.json();
}
 
async function getArtistAlbums(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`);
  return res.json();
}
 
export default async function Page({
  params: { username },
}: {
  params: { username: string };
}) {
  // Initiate both requests in parallel
  const artistData = getArtist(username);
  const albumsData = getArtistAlbums(username);
 
  // Wait for the promises to resolve
  const [artist, albums] = await Promise.all([artistData, albumsData]);
 
  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums}></Albums>
    </>
  );
}
```

By starting the fetch prior to calling **`await`** in the Server Component, each request can eagerly start to fetch requests at the same time. This sets the components up so you can avoid waterfalls.

We can save time by initiating both requests in parallel, however, the user won't see the rendered result until both promises are resolved.

To improve the user experience, you can add a [suspense boundary](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming) to break up the rendering work and show part of the result as soon as possible:

```ts
import { getArtist, getArtistAlbums, type Album } from './api';
 
export default async function Page({
  params: { username },
}: {
  params: { username: string };
}) {
  // Initiate both requests in parallel
  const artistData = getArtist(username);
  const albumData = getArtistAlbums(username);
 
  // Wait for the artist's promise to resolve first
  const artist = await artistData;
 
  return (
    <>
      <h1>{artist.name}</h1>
      {/* Send the artist information first,
          and wrap albums in a suspense boundary */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <Albums promise={albumData} />
      </Suspense>
    </>
  );
}
 
// Albums Component
async function Albums({ promise }: { promise: Promise<Album[]> }) {
  // Wait for the albums promise to resolve
  const albums = await promise;
 
  return (
    <ul>
      {albums.map((album) => (
        <li key={album.id}>{album.name}</li>
      ))}
    </ul>
  );
}
```

Take a look at the [preloading pattern](https://nextjs.org/docs/app/building-your-application/data-fetching/caching#preload-pattern-with-cache) for more information on improving components structure.

### Sequential Data Fetching

To fetch data sequentially, you can **`fetch`** directly inside the component that needs it, or you can **`await`** the result of **`fetch`** inside the component that needs it:

```ts
// ...
 
async function Playlists({ artistID }: { artistID: string }) {
  // Wait for the playlists
  const playlists = await getArtistPlaylists(artistID);
 
  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  );
}
 
export default async function Page({
  params: { username },
}: {
  params: { username: string };
}) {
  // Wait for the artist
  const artist = await getArtist(username);
 
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  );
}
```

By fetching data inside the component, each fetch request and nested segment in the route cannot start fetching data and rendering until the previous request or segment has completed.

### Blocking Rendering in a Route

By fetching data in a [layout](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts), rendering for all route segments beneath it can only start once the data has finished loading.

In the **`pages`** directory, pages using server-rendering would show the browser loading spinner until **`getServerSideProps`** had finished, then render the React component for that page. This can be described as "all or nothing" data fetching. Either you had the entire data for your page, or none.

In the **`app`** directory, you have additional options to explore:

1. First, you can use **`loading.js`** to show an instant loading state from the server while streaming in the result from your data fetching function.

2. Second, you can move data fetching lower in the component tree to only block rendering for the parts of the page that need it. For example, moving data fetching to a specific component rather than fetching it at the root layout.

Whenever possible, it's best to fetch data in the segment that uses it. This also allows you to show a loading state for only the part of the page that is loading, and not the entire page.

<hr />

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
# nextjs13-fetching-data
