require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.once("open", () => console.log("connected to mongoDB!!!!"));

const ShoppingList = require("./models/ShoppingList");

app.use(express.json());

app.get("/shoppinglists", (req, res) => {
  ShoppingList.find().then((results) => res.status(200).json(results));
});

app.post("/shoppinglists", (req, res) => {
  const newShoppingList = new ShoppingList(req.body);
  newShoppingList.save();
  res.status(201).json(newShoppingList);
});

app.get("/shoppinglists/:shoppingListId", (req, res) => {
  ShoppingList.findById(req.params.shoppingListId)
    .then((results) => {
      if (results) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "Shop not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
});

app.patch("/shoppinglists/:shoppingListId", (req, res) => {
  ShoppingList.findById(req.params.shoppingListId)
    .then((shoppingList) => {
      // if shopping List is not found, return 404
      if (shoppingList) {
        shoppingList.name = req.body.name || shoppingList.name;
        shoppingList.save();
        res.status(200).json(shoppingList);
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
});

app.delete("/shoppinglists/:shoppingListId", (req, res) => {
  ShoppingList.findByIdAndDelete(req.params.shoppingListId)
    .then((shoppingList) => {
      if (shoppingList) {
        res.status(200).json({deleted: shoppingList});
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//app.post for adding items
//bookmark.motes.push(newNote)
//newNote: request.body
