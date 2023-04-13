import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Head from "next/head";
import { ResultsProps } from "../../interfaces/interfaces";
import Image from "next/image";

const Results: React.FC<ResultsProps> = ({ reactions, urls, resolution }) => {
  return (
    <>
      <Head>
        <title>Reactions</title>
      </Head>
      <div className="main">
        {Object.keys(reactions).map((key) => (
          <div key={uuidv4()} className="card-reaction">
            <Image
              width={540}
              height={resolution === "square" ? 540 : 675}
              alt=""
              className={`image-slider-${
                resolution === "square" ? "square" : "vertical"
              }`}
              src={urls[key]}
            />
            <h3 className="reaction">
              <i className="fa-solid fa-heart"></i>
              <span style={{ marginLeft: 8 }}>{reactions[key]}</span>
            </h3>
          </div>
        ))}
      </div>
    </>
  );
};

export async function getServerSideProps(context: {
  query: { collection_id: string };
}) {
  const { collection_id } = context.query;
  const resUrls = await axios.get(`${process.env.API_HOST}/${collection_id}`);
  const responseUrls: string[] = await resUrls.data.result[0];
  const resolution = responseUrls["resolution"];
  delete responseUrls["_id"]; // deleting _id, collection_id, resolution
  delete responseUrls["collection_id"];
  delete responseUrls["resolution"];
  const urls: string[] = Object.values(responseUrls);

  const resReactions = await axios.get(
    `${process.env.API_HOST}/reactions/${collection_id}`
  );
  let reactions: string[] = await resReactions.data["0"];
  try {
    delete reactions["_id"];
    delete reactions["collection_id"];
  } catch (e) {
    for (let i = 0; i < urls.length; i++) {
      reactions.push("0");
    }
  }

  return { props: { reactions, urls, resolution } };
}
export default Results;
