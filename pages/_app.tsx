import { Provider } from 'next-auth/client';
import "../styles/globals.css"

export default ({ Component, pageProps }) => {
  const { session } = pageProps;
  return (
    <Provider session={session}>
      <Component {...pageProps} />
    </Provider>
  );
};