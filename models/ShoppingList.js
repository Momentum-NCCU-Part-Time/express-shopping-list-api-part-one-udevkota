const mongoose = require("mongoose");

const shoppingListSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    items: [
      { 
        type: new mongoose.Schema(
          {
            itemName: { type: String },
            quantity: { type: String }, 
            purchased: { 
              type: Boolean,
              default: false,
            }
          },
          { timestamps: true }  
        )
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShoppingList", shoppingListSchema);

