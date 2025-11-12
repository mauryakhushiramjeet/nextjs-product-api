import { databaseConnection } from "@/lib/dbConfig";
import Product from "@/lib/models/ProductModel";
import Sale from "@/lib/models/SaleModel";
import { verifyToken } from "@/lib/tokenmanage/verifyToken";
import { promises } from "dns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const pageParams = url.searchParams.get("page");
    const page = Number(pageParams) || 1;
    const limit = 10;
    const category = url.searchParams.get("category");
    const bestSeller = url.searchParams.get("bestSeller");
    await databaseConnection();
    const offset = (page - 1) * limit;
    const totalProducts = await Product.countDocuments({});
    const totalpages = Math.ceil(totalProducts / limit);
    let product = await Product.find({}).skip(offset).limit(limit);
    if (category && category != null) {
      product = await Product.find({ category: category });
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
    if (sales.length > 0 && sales[0].category == "all productes") {
      const productData = product.map((product) => {
        const discount = sales[0]?.disccountPercentage || 0;
        const discountedPrice = Math.floor(
          product.price - (product.price * discount) / 100
        );
        return {
          ...product.toObject(),
          originalPrice: product.price,
          discount,
          discountedPrice,
        };
      });
      return NextResponse.json({
        success: true,
        page,
        limit,
        totalpages,
        forAll:true,
        items: product.length,
        message: "Products with sale discounts fetched successfully",
        product: productData,
      });
    }
    const updatedProducts = product.map((product) => {
      const related_Product_of_SaleCategory = sales.find(
        (sale) => sale.category.toLowerCase() === product.category.toLowerCase()
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
