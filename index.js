const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 4444 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY)
var jwt = require('jsonwebtoken');


// middleware
app.use(cors())
app.use(express.json())


const verifyJWT = (req,res,next) =>{
const authorization = req.headers.authorization 
if(!authorization){
  return res.status(401).send({error: true ,mssage: 'unothorized'})
}
const token = authorization.split(' ')[1]

jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
  if(err){
    return res.status(401).send({error: true ,mssage: 'unothorized'})  }
    req.decoded = decoded 
    next()
})
}



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
     const manageclassCollection = client.db("musicits").collection("manageclass")
     const myclassCollection = client.db("musicits").collection("myclass")



   //   jwt token 
       // JW TOKEN 
       app.post('/jwt', (req, res)=>{
         const user = req.body 
         const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET ,
           {expiresIn: '1h'})
         res.send({token})
       })

   //   users
   app.post('/users', async(req, res)=>{
      const item = req.body 
      const query = {email : item.email}
      const existinguser = await usersCollection.findOne(query) 
      console.log(existinguser);
      if(existinguser){
         return res.send({message : 'user exists'})
      } 
      const result = await usersCollection.insertOne(item)
      res.send(result)
    })
    
    app.patch('/users/instructor/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'instructor'
        }
      };
    
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });


    app.patch('/users/admin/:id', async(req,res)=>{
      const id  = req.params.id 
      const filter =  {_id : new ObjectId(id)}
      const updateDoc = {
         $set: {
           role : 'admin'
         },
       };
   const result = await usersCollection.updateOne(filter,updateDoc)
   res.send(result)
      })


      // isAdmin hole routes niye jabe or niye jabe na !  
      app.get('/users/instructor/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email }
        const user = await usersCollection.findOne(query);
        res.send({ isInstructor: user?.role === 'instructor' });
    })


      // isAdmin hole routes niye jabe or niye jabe na !  
      app.get('/users/admin/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email }
        const user = await usersCollection.findOne(query);
        console.log(user);
        res.send({ isAdmin: user?.role === 'admin' });
    })
      
    // isstudent hole routes niye jabe or niye jabe na !  
      app.get('/users/student/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email }
        const user = await usersCollection.findOne(query);
        console.log(user);
        res.send({ isStudent: user?.role === 'student' });
    })


    app.get('/users', async(req,res)=>{ 
      const result = await usersCollection.find().toArray() 
      res.send(result)
     })

   




// manage class
     app.get('/manageclass', async (req, res) => {
      const result = await manageclassCollection.find().sort({ total_users: -1 }).toArray();
      res.send(result);
    })

   app.post('/manageclass', async(req, res)=>{
      const item = req.body 
      const result = await manageclassCollection.insertOne(item)
      res.send(result)
    })



    app.patch('/manageclass/:id', async(req,res)=>{
      const id  = req.params.id 
      const filter =  {_id : new ObjectId(id)}
      const updateDoc = {
         $set: {
           status : 'Denied'
         },
       };
   const result = await manageclassCollection.updateOne(filter,updateDoc)
   res.send(result)
      })

    app.post('/updatedClass', async(req,res)=>{
      const item = req.body 
      const result = await classCollection.insertOne(item)
      const id = item.id
      const filter = {_id :new ObjectId(id) } 
      const updatedDoc = {
        $set : {
          'status' : 'approved'
        }
      }
      const approvedClass = await manageclassCollection.updateOne(filter,updatedDoc)
      res.send(result)
    })





     // peoblem email diye queery korar poreo ekhane sb email diye valye chole asteche 
     app.get('/myclass', async(req,res)=>{
      const email = req.query.email 
      if(!email){
         res.send([])
      } 
      const query = {email : email}
        const result = await manageclassCollection.find(query).toArray()
        res.send(result)
     })

    


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

     

// selected class
     
   app.post('/selectedclass', async(req, res)=>{
    const item = req.body 
    console.log(item);
    const result = await selectedclassCollection.insertOne(item)
    res.send(result)
  })

     app.get('/selectedclass',verifyJWT, async(req,res)=>{
      const email = req.query.email 
      if(!email){
         res.send([])
      } 
      const decodedEmail = req.decoded.email 
      if(email !== decodedEmail){
        return res.status(403).send({error: true , message: 'forbidden'})
      }

      const query = {email : email}
        const result = await selectedclassCollection.find(query).sort({ total_users: -1 }).toArray()
        res.send(result)
     })
     app.delete('/selectedclass/:id', async(req,res)=>{
      const id = req.params.id 
      const query = {_id : id}
      const result = await selectedclassCollection.deleteOne(query)
      res.send(result)
   }) 



     // create payment inten 
     app.post('/create-payment-intent',verifyJWT, async(req,res)=>{
      const {price} = req.body
      const amount = parseInt(price*100)
      console.log(price, amount);
      const paymentItent = await stripe.paymentIntents.create({
        amount : amount,
        currency : 'usd',
        payment_method_types: ['card']
      })
      res.send({
        clientSecret : paymentItent.client_secret
      })
    })

  app.post('/payments', async (req, res) => {
      const payment = req.body;
      const result = await paymentCollection.insertOne(payment)
      const id = payment.bookingId;
      const filter = { _id: new ObjectId(id) }
      const updatedDoc = {
          $set: {
              paid: true,
              transictionId:payment.transictionID
          }
      }
      const updateResult= await bookingCollection.updateOne(filter, updatedDoc)
      res.send(result)

  })
  app.get('/pay/:id', async(req,res)=>{
    const id = req.params.id 
    const query = {_id : id}
    const result = await selectedclassCollection.findOne(query) 
    console.log(result);
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