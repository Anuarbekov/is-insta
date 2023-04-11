import React from "react";
import TinderCard from "react-tinder-card";
import { v4 as uuidv4 } from "uuid";

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
      <TinderCard
        onSwipe={(direction) => onSwipe(direction, urls[0])}
        preventSwipe={["up", "down"]}
        className="swipe"
      >
        <img
          alt=""
          className={`image-slider-${
            resolution === "square" ? "square" : "vertical"
          }`}
          src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80"
        />
        </TinderCard>
    </>
  );
};

export default TinderCards;
