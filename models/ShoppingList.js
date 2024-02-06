const mongoose = require("mongoose");

const shoppingListSchema = new mongoose.Schema({
  name: {
    type: String,
    max: 50,
    required: true,
  },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("ShoppingList", shoppingListSchema);
