import mongoose, { Schema, Types } from "mongoose";
import { ProductType } from "./ProductModel";

export interface CartSchemaType {
  _id?: string;
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  quantityQuery: boolean;
  productDetailes: ProductType;
  addedAt: Date;
  total: number;
  quantity: number;
}
const CartSchema = new Schema<CartSchemaType>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  productDetailes: {
    type: Object,
  },
  addedAt: {
    type: Date,
  },
  quantityQuery: {
    type: Boolean,
    default: false,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
});
const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
export default Cart;
