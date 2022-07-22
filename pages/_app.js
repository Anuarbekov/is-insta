import "../styles/globals.css";
import { SizeWrapper } from "../components/ContextSize";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <SizeWrapper>
        <Component {...pageProps} />
      </SizeWrapper>
    </>
  );
}

export default MyApp;
