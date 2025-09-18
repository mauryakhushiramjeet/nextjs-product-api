import { databaseConnection } from "@/lib/dbConfig";
import { ImageBasestring64 } from "@/lib/ImageBasestring64";
import Product, { ProductType } from "@/lib/models/ProductModel";
import { verfyToken } from "@/lib/tokenmanage/verfyToken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const formData = await req.formData();

  console.log(FormData);
  try {
    await databaseConnection();
    await verfyToken(req);
    if (!id) {
      return NextResponse.json({ sucess: false, message: "Id is required" });
    }
    const findProduct = await Product.findById({ _id: id });
    if (!findProduct) {
      return NextResponse.json({
        success: false,
        message: "product is not found.",
      });
    }
    const productData: any = {};
    for (const [key, value] of formData.entries()) {
      if (key == "image" && value instanceof File) {
        const img = await ImageBasestring64(value);
        productData[key] = img;
      } else {
        productData[key] = value;
      }
    }
    console.log(productData, "product data is");
    const product = await Product.findByIdAndUpdate(
      { _id: id },
      { $set: productData },
      { new: true }
    );
    return NextResponse.json({
      success: true,
      message: "product updated",
      product,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
