import { SessionProvider } from "next-auth/react";
import Router from "next/router";
import NProgress from "nprogress";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import "../styles/nprogress.css";

Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Navbar />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
