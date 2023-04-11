import React from "react";
import { v4 as uuidv4 } from "uuid";
import dynamic from "next/dynamic";
const TinderCard = dynamic(() => import("react-tinder-card"), {
  ssr: false,
});
interface TinderCardsProps {
  urls: any;
  collection_id: string;
  resolution: string;
}
const TinderCards: React.FC<TinderCardsProps> = ({
  urls,
  collection_id,
  resolution,
}) => {
  const onSwipe = (direction: string, url: string) => {
    const data = {
      url_of_photo: url,
      reaction: direction === "right" ? "+" : "-",
    };
  };
  return (
    <>
      {urls.map((url: string) => (
        <TinderCard
          onSwipe={(direction) => onSwipe(direction, url)}
          preventSwipe={["up", "down"]}
          className="swipe"
        >
          <img
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
