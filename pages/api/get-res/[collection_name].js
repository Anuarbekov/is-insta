import client from "../../../utils/connectToMongoDB";
export default async function getImages(req, res) {
  res.setHeader('Cache-Control', 's-maxage=10'); 
  try {
    const code = req.query;
    client.connect((err) => {
      const collection = client.db("photos").collection(code.collection_name);
      collection.find({}).toArray((err, result) => {
        if (err) {
          res.status(500).json({ err });
        } else {
          res.status(200).json(result[0]);
        }
      });
    });
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
}
