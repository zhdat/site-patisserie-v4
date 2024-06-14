import { AppProps } from "next/app";
import "../app/globals.css"; // Adjust the path for your global styles
import RootLayout from "../app/layout"; // Adjust the path accordingly

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default MyApp;
