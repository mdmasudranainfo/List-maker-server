const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cors());

function run() {
  const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
  const uri = `mongodb+srv://mdmasudranainfo:${process.env.PASSWORD}@cluster0.sfxqpsq.mongodb.net/?retryWrites=true&w=majority`;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  const taskCollection = client.db("Task_Maker").collection("Task");

  app.post("/addtask", async (req, res) => {
    const task = req.body;
    const result = await taskCollection.insertOne(task);
    res.send(result);
  });
  //   get
  app.get("/task", async (req, res) => {
    const email = req.query.email;
    const query = { email, complite: false };
    const task = await taskCollection.find(query).toArray();
    res.send(task);
  });

  // get single
  app.get("/task/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await taskCollection.findOne(query);
    res.send(result);
  });

  // update data
  app.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const doc = req.body;
    const query = { _id: ObjectId(id) };
    const options = { upsert: true };

    const updateDoc = {
      $set: doc,
    };

    const result = await taskCollection.updateOne(query, updateDoc, options);
    res.send(result);
  });

  //   complite get
  app.get("/complite", async (req, res) => {
    const email = req.query.email;
    const query = { email, complite: true };
    const task = await taskCollection.find(query).toArray();
    res.send(task);
  });

  // delete
  app.delete("/task/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await taskCollection.deleteOne(query);
    res.send(result);
  });

  // complite task
  app.put("/complite/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const options = { upsert: true };

    const updateDoc = {
      $set: {
        complite: true,
      },
    };

    const result = await taskCollection.updateOne(query, updateDoc, options);
    res.send(result);
  });

  //   end
}

run();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
