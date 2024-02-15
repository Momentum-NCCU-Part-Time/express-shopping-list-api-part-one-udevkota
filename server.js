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

//Get all data
app.get("/shoppinglists", (req, res) => {
  ShoppingList.find().then((results) => res.status(200).json(results));
});

//Get 1 store by shoppingListId
app.get("/shoppinglists/:shoppingListId", (req, res) => {
  ShoppingList.findById(req.params.shoppingListId)
    .then((results) => {
      if (results) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "Store not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
});

//add store name
app.post("/shoppinglists", (req, res) => {
  const newShoppingList = new ShoppingList(req.body);
  newShoppingList.save();
  res.status(201).json(newShoppingList);
});

//Add item
app.post("/shoppinglists/:shoppingListId/items", (req, res) => {
  ShoppingList.findById(req.params.shoppingListId)
    .then((shoppingList) => {
      if (shoppingList) {
        shoppingList.items.push({ itemName: req.body["items"], quantity: req.body["quantity"], purchased: req.body["purchased"] });
        shoppingList.save();
        return res.status(200).json(shoppingList);
      } else {
        return res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
});

//update store name
app.patch("/shoppinglists/:shoppingListId", (req, res) => {
  ShoppingList.findById(req.params.shoppingListId)
    .then((shoppingList) => {
      // if shopping List is not found, return 404
      if (shoppingList) {
        shoppingList.storeName = req.body.storeName || shoppingList.storeName;
        shoppingList.save();
        res.status(200).json(shoppingList);
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
});

//update item
app.patch("/shoppinglists/:shoppingListId/items/:itemId", (req, res) => {
  ShoppingList.findById(req.params.shoppingListId)
    .then((shoppingList) => {
      if (!shoppingList) {
        res.status(404).json({ message: "Store not found" });
      } else {
        const item = shoppingList.items.id(req.params.itemId);
        if (!item) {
          res.status(404).json({ message: "Item not found" });
        } else {
          const { itemName, quantity, purchased } = req.body;
          item.itemName = itemName || item.itemName;
          item.quantity = quantity || item.quantity;
          //may have to do line below in a separate route by itself? with route /purchased?
          item.purchased = !item.purchased;
          shoppingList
            .save()
            //why do we have to do this one in a then ????
            .then(() => res.status(200).json(item))
            .catch((error) => res.status(400).json({ message: error.message }));
        }
      }
    })
    .catch((error) => res.status(400).json({ message: error.message }));
});

//delete store name
app.delete("/shoppinglists/:shoppingListId", (req, res) => {
  ShoppingList.findByIdAndDelete(req.params.shoppingListId)
    .then((shoppingList) => {
      if (shoppingList) {
        res.status(200).json({ deleted: shoppingList });
      } else {
        res.status(404).json({ message: "Store not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
});

//delete item
app.delete("/shoppinglists/:shoppingListId/items/:itemId", (req, res) => {
  ShoppingList.findById(req.params.shoppingListId)
    .then((shoppingList) => {
      if (shoppingList) {
        shoppingList.items.id(req.params.itemId).deleteOne();
        shoppingList.save();
        res.status(200).json({ message: "item deleted" });
      } else {
        res.status(404).json({ message: "Store not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
