const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t86vw4m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);


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
    await client.connect();

    const tourCollection = client.db('tourdb').collection('tour');
    const countryCollection = client.db('countrydb').collection('country');
app.get('/tour',async(req,res)=>{
  const cursor = tourCollection.find();
  const result = await cursor.toArray();
  res.send(result);

})

app.get('/tour/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id:new ObjectId(id)}
  const result = await tourCollection.findOne(query)
res.send(result)
})


app.get("/intour/:email",  async(req,res)=>{
  console.log(req.params.email);
  const result =await tourCollection.find({ email:req.params.email }).toArray();
console.log(result);
  res.send(result)


  
})

app.get("/update/:id",async(req,res)=>{
  // console.log(req.params.id);
  const id = req.params.id;
  const query = {_id:new ObjectId(id)}
  const result = await tourCollection.findOne(query)
  console.log(result);
  res.send(result);
})

app.put("/updateTour/:id",async(req,res)=>{
  console.log(req.params.id);
  const query = {_id: new ObjectId(req.params.id)};
  const data ={
    $set:{
      spot:req.body.spot,
      country:req.body.country,
      location:req.body.location,
      description:req.body.description,
      cost:req.body.cost,
      season:req.body.season,
      time:req.body.time,
      visitor:req.body.visitor,
    }
  }
  const result =await tourCollection.updateOne(query,data);
  console.log(result);
  res.send(result)
})
   
    app.post('/tour',async(req,res) =>{
      const  newTour = req.body;
      console.log(newTour);
      const result = await tourCollection.insertOne(newTour);
      res.send(result);
    })

app.delete("/delete/:id",async(req,res)=>{
  const result = await tourCollection.deleteOne({_id:new ObjectId(req.params.id)})
  console.log(result);
  res.send(result)
})
    

app.post('/country',async(req,res)=>{
  const country = req.body;
  console.log(country);
  const result = await countryCollection.insertOne(country)
  res.send(result)
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('live server is running');
})

app.listen(port,()=>{
    console.log(`live serve:${port}`);
})