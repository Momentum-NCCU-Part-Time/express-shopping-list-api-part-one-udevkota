const express = require("express");
const mongoose = require('mongoose');
const ShoppingList = require("./models/ShoppingList");

const app = express();
const db = mongoose.connection
const PORT = 3000


//mongoose connect/setup
require('dotenv').config()
mongoose.connect(process.env.DATABASE_URL)
db.once("open", () => console.log("connected to mongoDB"))

app.use(express.json)

app.get('/shoppinglists', (req, res) => {
    ShoppingList.find().then((results) => res.status(200).json(results))
})

app.post('/shoppinglists', (req, res) => {
    const newShoppingList = new ShoppingList(req.body)
    newShoppingList.save()
    res.status(201).json(newShoppingList)
})

app.get('/shoppinglists/:shoppinglistId', (req, res) => {
    ShoppingList.findById(req.params.shoppingListId)
      .then((results) => {
        if (results) {
          res.status(200).json(results)
        } else {
          res.status(404).json({ message: 'not found' })
        }
      })
      .catch((error) => res.status(400).json({ message: 'Bad request' }))
  })

app.patch('/shoppinglists/:shoppinglistId', (req, res) => {
  ShoppingList.findById(req.params.shoppingListId)
  .then((shoppingList) => {
    // if shopping List is not found, return 404
    if (shoppingList) {
      shoppingList.name = req.body.name || shoppingList.name
      shoppingList.save()
      res.status(200).json(shoppingList)
    } else {
      res.status(404).json({ message: 'not found' })
    }
  })
  .catch((error) => res.status(400).json({ message: 'Bad request' }))
})

app.delete('/shoppinglists/:shoppinglistId', (req, res) => {
  ShoppingList.findById(req.params.shoppingListId)
  .then((shoppingList) => {
    if (shoppingList) {
      shoppingList.deleteOne()
      shoppingList.save()
      res.status(200).json(shoppingList)
    } else {
      res.status(404).json({ message: 'not found' })
    }
  })
  .catch((error) => res.status(400).json({ message: 'Bad request' }))
})

// const config = { port: process.env.PORT || 3000 };
app.listen(process.env.PORT || PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})