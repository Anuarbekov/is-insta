import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import TinderCard from "react-tinder-card";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Results = ({ response }) => {
  const router = useRouter();
  const { collection_name } = router.query;
  const [results, setResults] = useState([]);
  let resolution;
  useEffect(() => {
    toast.loading("Getting reactions...", {
      position: "top-right",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
    function closeToast() {
      toast.dismiss();
    }
    setTimeout(closeToast, 2000);
    if (collection_name) {
      resolution = localStorage.getItem("resolution");
      response.map(async (image) => {
        await axios
          .post(
            `https://is-insta.vercel.app/api/results?col_name=${collection_name}`,
            { url: image.url },
            { "Content-Type": "application/json" }
          )
          .then((res) => {
            const url = image.url;
            let ressultOfUrl = res.data;
            setResults((prevItems) => [...prevItems, { url, ressultOfUrl }]);
          });
      });
    }
  }, [collection_name]);

  return (
    <>
      <Head>
        <title>Reactions</title>
        <script
          src="https://kit.fontawesome.com/e35f419637.js"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <div className="main">
        <ToastContainer theme="dark" />
        {results.map((result) => (
          <div key={uuidv4()} className="card-reaction">
            <TinderCard
              key={uuidv4()}
              preventSwipe={["up", "down", "left", "right"]}
            >
              <img
                className={`image-slider-${
                  resolution === "square" ? "square" : "vertical"
                }`}
                src={result.url}
              ></img>
            </TinderCard>
            <h3 className="reaction">
              {result.ressultOfUrl[0]} <i className="fa-solid fa-heart"></i>,{" "}
              {result.ressultOfUrl[1]}{" "}
              <i className="fa-solid fa-heart-crack"></i>
            </h3>
          </div>
        ))}
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
  return { props: { response } };
}
export default Results;
