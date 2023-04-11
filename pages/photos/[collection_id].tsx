import React from "react";
import { useEffect } from "react";
import axios from "axios";
import TinderCards from "../../components/TinderCards";
import Head from "next/head";

interface PhotosProps {
  urls: string[];
  collection_id: string;
  resolution: string;
}

const Photos: React.FC<PhotosProps> = ({ urls, collection_id, resolution }) => {
  useEffect(() => {
    if (resolution === "square") {
      document.body.style.height = "100vh";
    }
  }, [collection_id]);
  return (
    <>
      <Head>
        <title>Photos</title>
      </Head>
      <div className="main">
        <h1 className="photos-text">Photos</h1>
        <a
          target="_blank"
          href={`http://localhost:3000/results/${collection_id}`}
          className="photos-text"
          rel="noreferrer"
        >
          Results
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
  const res = await axios.get(`http://localhost:8080/${collection_id}`);
  const response: string[] = await res.data.result[0];
  const urls: string[] = Object.values(response).filter((url: String) =>
    url.startsWith("data")
  );
  const resolution: string = response["resolution"];
  return { props: { urls, collection_id, resolution } };
}
export default Photos;
