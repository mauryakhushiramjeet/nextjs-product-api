import { models, Schema } from "mongoose";
import mongoose from "mongoose";
export interface ProductType {
  _id?: string;
  image: null | File | string;
  name: string;
  price: number | string;
  category: string;
  description: string;
  available?: boolean;
  bestSeller: boolean;
  originalPrice?: number | null;
  discount?: number | null;
  discountedPrice?: number | null;
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
  bestSeller: {
    type: Boolean,
    required: true,
  },
  category: {
    type: String,
    enum: ["cloth", "food", "makeup", "jewellery"],
  },
  description: {
    type: String,
  },
  available: {
    type: Boolean,
    required: true,
  },
});
const Product = models.Product || mongoose.model("Product", productSchema);
export default Product;
