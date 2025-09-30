import { databaseConnection } from "@/lib/dbConfig";
import { ImageBasestring64 } from "@/lib/ImageBasestring64";
import Product from "@/lib/models/ProductModel";
import { checkAdmin } from "@/lib/tokenmanage/checkAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const FormData = await req.formData();
  const name = FormData.get("name") as string;
  const image = FormData.get("image") as File;
  const price = FormData.get("price") as string;
  const description = FormData.get("description") as string;
  const bestSeller = FormData.get("bestSeller") as string;
  const available = FormData.get("available") as string;
  const category = FormData.get("category") as string;

  try {
    await databaseConnection();
    await checkAdmin(req);

    if (
      !image ||
      !price ||
      !category ||
      !name ||
      !description ||
      !bestSeller ||
      !available
    ) {
      return NextResponse.json({
        success: false,
        message: "Please fill all detailes of product",
        data: {
          image,
          name,
          bestSeller,
          description,
          category,
          price,
          available,
        },
      });
    }
    const basestring64 = await ImageBasestring64(image);
    const priceData = parseInt(price);
    const productData = {
      image: basestring64,
      name,
      price: priceData,
      category,
      bestSeller,
      description,
      available,
    };
    const product = new Product(productData);
    await product.save();
    return NextResponse.json({
      success: true,
      message: "product added successfully",
      data: product,
    });
  } catch (error: unknown) {
  let message = "Something went wrong";

  if (error instanceof Error) {
    message = error.message; // safe
  }

  return NextResponse.json({ success: false, message });
}

}
