import "../styles/globals.css";
import {Provider} from "next-auth/client";
import Navbar from "../components/Navbar";
import NProgress from "nprogress";
import "../styles/nprogress.css";
import Router, { useRouter } from "next/router";

Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <Provider session={pageProps.session}>
      <Navbar />
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
