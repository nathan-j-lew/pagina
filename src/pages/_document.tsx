import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html
      lang="en"
      className="max-sm:overflow-x-auto max-sm:overflow-y-hidden min-h-dvh min-w-screen"
    >
      <Head />
      <body className="antialiased w-max">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
