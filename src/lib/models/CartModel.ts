import mongoose, { Schema } from "mongoose";
import { ProductType } from "./ProductModel";
import { number } from "yup";

export interface CartSchemaType {
  _id?: string;
  userId: string;
  productId: string;
  quantityQuery: boolean;
  productDetailes: ProductType;
  addedAt: Date;
  total: number;
  quantity: number;
}
export const CartSchemaInitial: CartSchemaType = {
  userId: "",
  productId: "",
  quantityQuery: false,
  total: 0,
  productDetailes: {
    image: "",
    name: "",
    price: "",
    category: "",
    description: "",
    bestSeller: false,
    available: false,
  },
  addedAt: new Date(),
  quantity: 0,
};
const CartSchema = new Schema<CartSchemaType>({
  userId: {
    type: String,
  },
  productId: {
    type: String,
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
