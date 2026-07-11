const { MongoClient } = require('mongodb');

async function run() {
  const uri = "mongodb+srv://fundforge:CtPxI4PHM9MMvuzp@cluster0.d1hfqyj.mongodb.net/?appName=Cluster0";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('fundforge');
    const result = await db.collection('user').updateMany({}, { $set: { emailVerified: true } });
    console.log(result);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
