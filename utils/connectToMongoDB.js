const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://anuarbekov_005:Anuarbekov2006@isinsta.gwkdu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
/*client.connect(async (err) => {
  const collection = client
    .db("test")
    .collection("a81a8e3e-4d50-4207-9678-6d8a28799290");
  
  client.close();
});*/
export default client;
