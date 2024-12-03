require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const PORT = process.env.PORT || 5005

const app = express()

// middleware
app.use(cors())
app.use(express.json())

// username: coffee-store;
// password: QepUy0NjpnaZGDTw;

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.2crho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
console.log(uri)
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
        // await client.connect();
        const database = client.db("coffeeDB");
        const coffeeCollection = database.collection("coffee");
        const usersCollection = client.db("coffeeDB").collection("users");

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id
            // Query for a movie that has the title 'The Room'
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query)
            res.send(result)
        })
        app.put('/coffee/:id',async(req,res)=>{
            const id = req.params.id;
            const coffee = req.body;

            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateCoffee = {
                $set: {
                  name : coffee.name,
                  chef : coffee.chef,
                  price : coffee.price,
                  photo : coffee.photo
                },
              };
              const result = await coffeeCollection.updateOne(filter,updateCoffee,options)
              res.send(result)
        })
        app.post('/coffee', async (req, res) => {
            const coffee = req.body;
            console.log(coffee)
            const result = await coffeeCollection.insertOne(coffee);
            res.send(result)
        })
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id
            // Query for a movie that has title "Annie Hall"
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
        })

        // user collection start here
        app.get('/users', async (req,res)=>{
            const cursor = usersCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/users', async (req, res) => {
            const newUsers = req.body;
            console.log(newUsers)
            const result = await usersCollection.insertOne(newUsers);
            res.send(result)
        })
        app.patch('/users',async(req,res)=>{
            const email = req.body.email;
            const lastSignInTime = req.body.lastSignInTime;
            const filter = { email : email };
            const updateUser = {
                $set: {
                  lastSignInTime: lastSignInTime
                },
              };
              const result = await usersCollection.updateOne(filter, updateUser);
              res.send(result)  

        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            // Query for a movie that has title "Annie Hall"
            const query = { _id: new ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('<h1>Welcome to Coffee-Store-Server Site</h1>')
})

app.listen(PORT, () => {
    console.log(`coffee store server is running at http://localhost:${PORT}`)
})

// vercel --prod