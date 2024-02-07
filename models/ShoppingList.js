const mongoose = require("mongoose");

const shoppingListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShoppingList", shoppingListSchema);
