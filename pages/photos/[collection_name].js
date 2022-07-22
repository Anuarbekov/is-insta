import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import TinderCards from "../../components/TinderCards";
import Head from "next/head";
let resolution;
const Photos = ({ response, resolution }) => {
  const [urls, setUrls] = useState([]);
  const router = useRouter();
  const { collection_name } = router.query;
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    if (collection_name) {
      response.map(async (image) => {
        setUrls((prevUrls) => [...prevUrls, image.url]); //save urls to "urls"
      });
    }
  }, [collection_name]);
  return (
    <>
      <Head>
        <title>Photos</title>
      </Head>
      <div className="main">
        <h1 className="photos-text">Photos</h1>

        <a
          target="_blank"
          href={`https://is-insta.vercel.app/results/${collection_name}`}
          className="photos-text"
          rel="noreferrer"
        >
          Results
        </a>
        <TinderCards
          className="tinder-photos"
          urls={urls}
          collection_name={collection_name}
          resolution={resolution}
        />
      </div>
    </>
  );
};
export async function getServerSideProps(context) {
  const { collection_name } = context.query;
  const res = await axios.get(
    `https://is-insta.vercel.app/api/all/${collection_name}`
  );
  const response = await res.data;
  const resol = await axios.get(`https://is-insta.vercel.app/api/get-res/${collection_name}`)
  const resolution = resol.data.resolution;
  return { props: { response, resolution } };
}
export default Photos;
