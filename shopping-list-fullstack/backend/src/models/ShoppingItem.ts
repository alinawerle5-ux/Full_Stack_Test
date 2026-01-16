import mongoose, { Schema, model, type InferSchemaType } from "mongoose";

const shoppingItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 120,
    },
    bought: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type ShoppingItem = InferSchemaType<typeof shoppingItemSchema>;

// IMPORTANT: bei watch/hot-reload nicht erneut kompilieren
export const ShoppingItemModel =
  (mongoose.models.ShoppingItem as mongoose.Model<ShoppingItem>) ||
  model<ShoppingItem>("ShoppingItem", shoppingItemSchema);
