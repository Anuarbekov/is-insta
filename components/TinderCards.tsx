import { v4 as uuidv4 } from "uuid";
import dynamic from "next/dynamic";
import axios from "axios";
import { TinderCardsProps } from "../interfaces/interfaces";
const Image = dynamic(() => import("next/future/image"));
const TinderCard = dynamic(() => import("react-tinder-card"), {
  ssr: false,
});

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
    await axios.post(`${process.env.API_HOST}/uploads/reactions`, data);
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
            width={540}
            height={resolution === "square" ? 540 : 675}
            alt=""
            className={`image-slider-${
              resolution === "square" ? "square" : "vertical"
            }`}
            src={url}
            quality={100}
          />
        </TinderCard>
      ))}
    </>
  );
};
export default TinderCards;
