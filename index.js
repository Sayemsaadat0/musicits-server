const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 4444 
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()


// middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.njebycd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
     client.connect();

    //  collections
     const classCollection = client.db("musicits").collection("classes");
     const instractorCollection = client.db("musicits").collection("instractor");
     const popularclassCollection = client.db("musicits").collection("popularclass");
     const popularinstractorCollection = client.db("musicits").collection("popularinstractor");















    //  getting data from the databse
     app.get('/classes', async(req,res)=>{
        const result = await classCollection.find().toArray()
        res.send(result)
     })
     app.get('/instractor', async(req,res)=>{
        const result = await instractorCollection.find().toArray()
        res.send(result)
     })
     app.get('/popularclass', async(req,res)=>{
        const result = await popularclassCollection.find().toArray()
        res.send(result)
     })
     app.get('/popularinstractor', async(req,res)=>{
        const result = await popularinstractorCollection.find().toArray()
        res.send(result)
     })








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