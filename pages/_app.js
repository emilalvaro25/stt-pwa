import Head from 'next/head';
import '../styles/globals.css'; // Assuming you have this file for base styles

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E3A8A" />
        <link rel="apple-touch-icon" href="/icons/icon-512x512.svg"></link>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
