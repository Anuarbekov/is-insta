import client from "../../../utils/connectToMongoDB";

export default async function addPhotoUrl(req, res) {
  const { name, url } = req.body;
  const { collection_name } = req.query;
  try {
    client.connect(async () => {
      const collection = client.db("photos").collection(collection_name);
      await collection.insertOne({ name, url });
    });
  } catch (err) {
    console.log(err);
  }
}
