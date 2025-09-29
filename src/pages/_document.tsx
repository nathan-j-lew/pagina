import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="w-max">
      <Head />
      <body className="antialiased w-max overflow-hidden text-pizzi-base">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
