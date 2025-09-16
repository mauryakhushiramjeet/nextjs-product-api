import * as Yup from "yup";
export const addProductValidation = Yup.object({
  name: Yup.string().min(2).required(),
  image: Yup.string().required(),
  description: Yup.string().required(),
  price: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(1)
    .required(),
});
// import { models, Schema } from "mongoose";
// import mongoose from "mongoose";
// export interface ProductType {
//   _id:string,
//   image: string;
//   name: string;
//   price: number;
//   category: string;
//   description: string;
//   available?: boolean;
//   bestSeller: boolean;
// }
// const productSchema = new Schema<ProductType>({
//   image: {
//     type: String,
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   bestSeller: {
//     type: Boolean,
//     required: true,
//   },
//   category: {
//     type: String,
//     enum: ["cloth", "food", "mekeup", "jewellery"],
//   },
//   description: {
//     type: String,
//   },
//   available: {
//     type: Boolean,
//     required: true,
//   },
// });
// const Product = models.Product || mongoose.model("Product", productSchema);
// export default Product;
