import React from "react";
import { v4 as uuidv4 } from "uuid";
import dynamic from "next/dynamic";
import axios from "axios";
import Image from "next/image";
const TinderCard = dynamic(() => import("react-tinder-card"), {
  ssr: false,
});
interface TinderCardsProps {
  urls: string[];
  collection_id: string;
  resolution: string;
}

const TinderCards: React.FC<TinderCardsProps> = ({
  urls,
  collection_id,
  resolution,
}) => {
  const onSwipe = async (direction: string, url: string) => {
    const data = {
      collection_id,
      reaction: direction === "right" ? "+" : "-",
      index: urls.indexOf(url),
    };
    const result = await axios.post(
      `http://localhost:8080/uploads/reactions`,
      data
    );
  };
  return (
    <>
      {urls.map((url: string) => (
        <TinderCard
          key={uuidv4()}
          onSwipe={(direction) => onSwipe(direction, url)}
          preventSwipe={["up", "down"]}
          className="swipe"
        >
          <Image
            fill={true}
            alt=""
            className={`image-slider-${
              resolution === "square" ? "square" : "vertical"
            }`}
            src={url}
          />
        </TinderCard>
      ))}
    </>
  );
};
export default TinderCards;
