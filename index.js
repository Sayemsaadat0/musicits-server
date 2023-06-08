const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 4444 
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()


// middleware
app.use(cors())
app.use(express.json())




const uri = "mongodb+srv://<username>:<password>@cluster0.njebycd.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
     client.connect();









    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
finally {}
}
run().catch(console.dir);



























app.get('/', (req, res)=>{
    res.send('musicits is tuning')
})


app.listen(port, ()=>{
    console.log(`musisits is tuneing new song ${port}`);
})