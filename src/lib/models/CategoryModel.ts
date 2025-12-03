import mongoose, { Schema,models } from "mongoose";

interface CategoryType {
  id?: string;
  categoryName: string;
}
const CategorySchema = new Schema<CategoryType>(
  {
    categoryName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Category = models.Category || mongoose.model("Category", CategorySchema);
export default Category;
