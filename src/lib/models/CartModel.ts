import mongoose, { Schema } from "mongoose";

export interface CartSchemaType {
  userId: string;
  productId: string;
  addedAt: Date;
  quantity: number;
}
export const CartSchemaInitial: CartSchemaType = {
  userId: "",
  productId: "",
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
  addedAt: {
    type: Date,
  },
  quantity: {
    type: Number,
    default: 0,
  },
});
const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
export default Cart;
