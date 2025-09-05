import { databaseConnection } from "@/lib/dbConfig";
import Product, { ProductType } from "@/lib/models/ProductModel";
import { verfyToken } from "@/lib/tokenmanage/verfyToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const FormData = await req.formData();
  // console.log(FormData())
  // console.loh()
  const name = FormData.get("name") as string;
  const image = FormData.get("image") as string;
  const price = FormData.get("price") as string;
  const description = FormData.get("description") as string;
  const bestSeller=FormData.get("bestSeller") as string

  const category = FormData.get("category") as string;

  try {
    await databaseConnection();
    await verfyToken(req);

    if (!image || !price || !category || !name || !description||!bestSeller) {
      return NextResponse.json({
        success: false,
        message: "Please fill all detailes of product",
      });
    }
    const priceData = parseInt(price);
    const productData = {
      image,
      name,
      price: priceData,
      category,
      bestSeller,
      description,
    };
    const product = new Product(productData);
    await product.save();
    return NextResponse.json({
      success: true,
      message: "product added successfully",
      data: product,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ success: false, message: error.message });
  }
}
