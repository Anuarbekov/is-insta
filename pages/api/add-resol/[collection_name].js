import client from "../../../utils/connectToMongoDB";

export default async function addResolution(req, res) {
  res.setHeader('Cache-Control', 's-maxage=10'); 
  const { resolution } = req.body;
  const { collection_name } = req.query;
  try {
    client.connect(async () => {
      const collection = client.db("photos").collection(collection_name);
      await collection.insertOne({ resolution });
    });
    res.status(200).send();
  } catch (err) {
    console.log(err);
  }
}
