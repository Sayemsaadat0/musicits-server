const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 4444 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
var jwt = require('jsonwebtoken');


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
     const usersCollection = client.db("musicits").collection("users")
     const selectedclassCollection = client.db("musicits").collection("selectedclass")



   //   jwt token 
       // JW TOKEN 
       app.post('/jwt', (req, res)=>{
         const user = req.body 
         const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET ,
           {expiresIn: '1h'})
   
         res.send({token})
       })

   //   post 
   app.post('/users', async(req, res)=>{
      const item = req.body 
      const result = await usersCollection.insertOne(item)
      res.send(result)
    })
    
   app.post('/selectedclass', async(req, res)=>{
      const item = req.body 
      const result = await selectedclassCollection.insertOne(item)
      res.send(result)
    })
  /*  app.post('/selectedclass', async(req, res)=>{
      const item = req.body 
      const result = await selectedclassCollection.insertOne(item)
      const id = item._id 
      const query = {_id : new ObjectId(id)}
      const updatedDoc =  {
         $set:{
         disabled : true 
      }} 
      const updateResult = await classCollection.updateOne(query,updatedDoc)
      res.send(result)
    })
 */





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
        const result = await popularclassCollection.find().sort({ total_users: -1 }).toArray()
        res.send(result)
     })
     app.get('/popularinstractor', async(req,res)=>{
        const result = await popularinstractorCollection.find().sort({ total_users: -1 }).toArray()
        res.send(result)
     })
     app.get('/selectedclass', async(req,res)=>{
        const result = await selectedclassCollection.find().sort({ total_users: -1 }).toArray()
        res.send(result)
     })




   //   delete data
   app.delete('/selectedclass/:id', async(req,res)=>{
      const id = req.params.id 
      const query = {_id : new ObjectId(id)}
      const result = await selectedclassCollection.deleteOne(query)
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