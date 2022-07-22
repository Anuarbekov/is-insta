import React from "react";
import TinderCard from "react-tinder-card";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const TinderCards = ({ urls, collection_name, resolution }) => {
  const onSwipe = async (direction, url) => {
    const data = {
      url_of_photo: url,
      reaction: direction === "right" ? "+" : "-",
    };
    const headers = {
      "Content-Type": "application/json",
    };
    await axios.post(`/api/reaction/${collection_name}`, data, headers);
  };
  return (
    <>
      {urls.map((url) => (
        <TinderCard
          onSwipe={(direction) => onSwipe(direction, url)}
          key={uuidv4()}
          preventSwipe={["up", "down"]}
          className="swipe"
        >
          <img className={`image-slider-${resolution === "square" ? "square" : "vertical"}`} src={url}></img>
        </TinderCard>
      ))}
    </>
  );
};

export default TinderCards;
