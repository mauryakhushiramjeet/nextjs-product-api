import { models, Schema } from "mongoose";
import mongoose from "mongoose";
export interface ProductType {
  image: string;
  name: string;
  price: number;
  category: string;
  // size:string
  description: string;
  available?: boolean;
}
const productSchema = new Schema<ProductType>({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["cloth", "food", "mekeup","jewellery"],
  },
  description: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
    required: true,
  },
});
const Product = models.Product || mongoose.model("Product", productSchema);
export default Product;
