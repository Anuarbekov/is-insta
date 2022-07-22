import client from "../../utils/connectToMongoDB";
export default async function ResultsApi(req, res) {
  const collection_name = req.query.col_name;
  const url_of_photo = req.body.url;
  const reactions = [];
  const results = [];
  client.connect(async () => {
    const coll_results = client.db("reactions").collection(collection_name);
    const dbResults = await coll_results
      .find({ url_of_photo: url_of_photo })
      .toArray();
    dbResults.map((result) => {
      reactions.push(result.reaction);
    });
    const plus = reactions.filter((react) => react === "+").length;
    const minus = reactions.filter((react) => react === "-").length;
    results.push(plus);
    results.push(minus);
    res.json(results);
  });
}
