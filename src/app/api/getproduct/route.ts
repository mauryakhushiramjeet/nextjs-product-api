import { databaseConnection } from "@/lib/dbConfig";
import Product from "@/lib/models/ProductModel";
import Sale from "@/lib/models/SaleModel";
import { NextRequest, NextResponse } from "next/server";
import Category from "@/lib/models/CategoryModel";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const pageParams = url.searchParams.get("page");
    const page = Number(pageParams) || 1;
    const limit = 10;
    const categoryId = url.searchParams.get("categoryId");
    const bestSeller = url.searchParams.get("bestSeller");
    await databaseConnection();
    const offset = (page - 1) * limit;
    const totalProducts = await Product.countDocuments({});
    const totalpages = Math.ceil(totalProducts / limit);
    let product = await Product.find({})
      .populate("categoryId", "_id categoryName",Category)
      .skip(offset)
      .limit(limit);

    if (categoryId && categoryId != null) {
      product = await Product.find({ categoryId: categoryId });
    } else if (bestSeller && bestSeller != null) {
      product = await Product.find({ bestSeller: true });
    }

    const sales = await Sale.find();
    if (sales.length == 0) {
      return NextResponse.json({
        success: true,
        message: "product geted successfully",
        product,
      });
    }

    const updatedProducts = product.map((product) => {
      const related_Product_of_SaleCategory = sales.find((sale) =>
        sale.categoryId.some(
          (catId :{ _id: mongoose.Schema.Types.ObjectId }) => catId.toString() === product.categoryId._id.toString()
        )
      );

      if (related_Product_of_SaleCategory) {
        const discount =
          related_Product_of_SaleCategory?.disccountPercentage || 0;
        const discountedPrice = Math.floor(
          product.price - (product.price * discount) / 100
        );
        return {
          ...product.toObject(),
          originalPrice: product.price,
          discount,
          discountedPrice,
        };
      }
      return product.toObject();
    });
    return NextResponse.json({
      success: true,
      page,
      limit,
      totalpages,
      items: product.length,
      message: "Products with sale discounts fetched successfully",
      product: updatedProducts,
    });
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }
    console.log(message);
    return NextResponse.json({ success: false, message });
  }
}
