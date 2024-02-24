const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const PORT = 5000;

require("dotenv").config();

const app = express();

let db,
  dbConnectionStr = process.env.DB_STRING,
  accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
    flags: "a",
  });
// dbName = "rap";

MongoClient.connect(dbConnectionStr)
  .then((client) => {
    console.log("Database connection established");

    db = client.db("Quotes-App");
  })
  .catch((err) => console.error(err));

app.set("view engine", "ejs");
app.use(
  morgan("dev", {
    stream: accessLogStream,
  })
);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  db.collection("quotes")
    .find()
    .sort({ name: 1 })
    .toArray()
    .then((result) => {
      fs.writeFile("db.js", JSON.stringify(result), (err) => {
        if (err) throw err;
        console.log("Result has been written to result.json");
      });
      res.render("index.ejs", { quotes: result });
    });
});

app.post("/quotes", (req, res) => {
  console.log("Post request successful");
  console.log(req.body);

  db.collection("quotes")
    .insertOne({
      name: req.body.name,
      quote: req.body.quote,
      likes: 0,
    })
    .then((result) => {
      console.log("quote added");
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

app.put("/addOneLike", (req, res) => {
  console.log(req.body);
  db.collection("quotes")
    .updateOne(
      {
        name: req.body.nameS,
        quote: req.body.quoteS,
        likes: req.body.likesS,
      },
      {
        $set: {
          likes: req.body.likesS + 1,
        },
      },
      {
        sort: { _id: -1 },
        upsert: true,
      }
    )
    .then((result) => {
      console.log("Added One Like");
      res.json("Like Added");
    })
    .catch((error) => console.error(error));
});

app.delete("/deleteQuote", (req, res) => {
  db.collection("quotes")
    .deleteOne({ name: req.body.nameS })
    .then((result) => {
      console.log("Quote Deleted");
      res.json("Quote Deleted");
    })
    .catch((error) => console.error(error));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port: ${process.env.PORT || PORT}`);
});
