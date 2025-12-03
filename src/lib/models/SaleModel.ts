import mongoose, { models, Schema } from "mongoose";

export interface SaleInterface {
  _id?: string;
  name: string;
  disccountPercentage: number;
  image: string | File;
  categoryId:mongoose.Schema.Types.ObjectId[];
  start: Date;
  end: Date;
}

const SaleSchema = new Schema<SaleInterface>({
  name: {
    type: String,
    required: true,
  },
  disccountPercentage: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  categoryId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
});
const Sale = models.Sale || mongoose.model("Sale", SaleSchema);
export default Sale;
