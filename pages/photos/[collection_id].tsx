import dynamic from "next/dynamic";
import axios from "axios";
import { PhotosProps } from "../../interfaces/interfaces";
import { useEffect } from "react";
const Head = dynamic(() => import("next/head"));
const TinderCards = dynamic(() => import("../../components/TinderCards"));

const Photos: React.FC<PhotosProps> = ({ urls, collection_id, resolution }) => {
  useEffect(() => {
    document.body.style.height = "105vh";
  }, []);
  return (
    <>
      <Head>
        <title>Photos</title>
      </Head>
      <div className="main">
        <h1 className="photos-text">Your Photos</h1>
        <a
          target="_blank"
          href={`${process.env.FRONT_HOST}/results/${collection_id}`}
          className="photos-text"
          rel="noreferrer"
        >
          See Results
        </a>
        <TinderCards
          urls={urls}
          collection_id={collection_id}
          resolution={resolution}
        />
      </div>
    </>
  );
};

export async function getServerSideProps(context: {
  query: { collection_id: string };
}) {
  const { collection_id } = context.query;
  const API_HOST = process.env.API_HOST;
  const resUrls = await axios.get(`${API_HOST}/${collection_id}`);
  const responseUrls: string[] = await resUrls.data.result[0];
  let resolution: string, urls: string[];
  try {
    resolution = responseUrls["resolution"];
    delete responseUrls["_id"];
    delete responseUrls["collection_id"];
    delete responseUrls["resolution"];
    urls = Object.values(responseUrls);
  } catch (e) {
    urls = [];
    resolution = "";
  }

  return { props: { urls, collection_id, resolution } };
}

export default Photos;
