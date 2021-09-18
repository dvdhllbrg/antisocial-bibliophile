import Head from 'next/head';
import TopAppBar from '@components/TopAppBar';

export default function About() {
  return (
    <>
      <Head>
        <title key="title">
          About the App | Antisocial Bibliophile
        </title>
      </Head>
      <TopAppBar title="About the App" />
      <main className="prose container mx-auto p-4">
        <p>
          This app was created by
          {' '}
          <a
            href="https://davidhallberg.design"
            target="_blank"
          >a Swedish guy named David</a>
          . It's built as a
          {' '}
          <a
            href="https://nextjs.org"
            target="_blank"
          >Next.js</a>,
          {' '}
          app, using
          {' '}
          <a
            href="https://tailwindcss.com"
            target="_blank"
          >Tailwind</a>
          {' '}
          for styling, and a sprinkling of
          {' '}
          <a
            href="https://heroicons.com"
            target="_blank"
          >Heroicons</a>
          {' '}
          here and there. All illustrations (including the app icon) are from
          {' '}
          <a
            href="https://undraw.co"
            target="_blank"
          >unDraw</a>
          , coincidentally one of the best open-source projects out there.
        </p>
        <p>
          Notice anything wrong with the app? Any bugs you want fixed, or features you would like added?
          {' '}
          <a
            href="https://github.com/dvdhllbrg/agr-next"
            target="_blank"
          >Create an issue on GitHub</a> (or go ahead and fix it yourself, pull requests are very welcome!) or
          {' '}
          <a
            href="https://twitter.com/dvdhllbrg"
            target="_blank"
          >hit me up on Twitter</a>
          . Hope you enjoy the app!
        </p>
      </main>
    </>
  );
}
