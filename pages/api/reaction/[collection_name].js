import client from "../../../utils/connectToMongoDB";
export default async function RatePhoto(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { url_of_photo, reaction } = req.body;
  const { collection_name } = req.query;
  try {
    client.connect(async () => {
      const collection = client.db("photos").collection(collection_name);
      if (collection.find({ url: url_of_photo })) {
        client
          .db("reactions")
          .collection(collection_name)
          .insertOne({ url_of_photo: url_of_photo, reaction: reaction });
        res.status(200).send();
      } else {
        res.status(500).send();
      }
    });
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.json("Error");
  }
}
