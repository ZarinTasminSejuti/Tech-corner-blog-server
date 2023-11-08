const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// // Middleware
const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.ggegvme.mongodb.net/?retryWrites=true&w=majority`;

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

    const blogCollection = client.db('blogsDB').collection("blogs");
    const commentCollection = client.db('blogsDB').collection("comment");
    const suggestionCollection = client.db('blogsDB').collection("suggestion");

    app.get('/addBlog', async (req, res) => {
      const cursor = blogCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

//View details Blog
    app.get('/BlogDetails/:_id', async (req, res) => {
      const blogID = req.params._id;
      const idObject = new ObjectId (blogID)
      const result = await blogCollection.findOne(idObject);
      res.send(result); 
    })

    //Get specific blog comment
    app.get('/comment', async (req, res) => {
      const commentFound = commentCollection.find();
      const result = await commentFound.toArray();
      res.send(result);
    })


    app.post('/addBlog', async (req, res) => {
      const newBlog = req.body;
      const result = await blogCollection.insertOne(newBlog);
      res.send(result); 
    })


     //for comment form
  app.post('/comment', async (req, res) => {
    const newComment = req.body;
    const result = await commentCollection.insertOne(newComment);
    res.send(result); 
  })

  
  //for suggestion form
  app.post('/suggestion', async (req, res) => {
    const newSuggestion = req.body;
    const result = await suggestionCollection.insertOne(newSuggestion);
    res.send(result); 
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







app.get('/', (req, res) => {
    res.send('Blog server is running');
});

app.listen(port, () => {
    console.log(`Blog server is running on port: ${port}`);
});