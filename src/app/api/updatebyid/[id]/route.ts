import { databaseConnection } from "@/lib/dbConfig";
import { ImageBasestring64 } from "@/lib/ImageBasestring64";
import Product from "@/lib/models/ProductModel";
import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/tokenmanage/checkAdmin";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const formData = await req.formData();

  console.log(FormData);
  try {
    await databaseConnection();
    await checkAdmin(req);
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
    const productData: { [key: string]: string } = {};
    for (const [key, value] of formData.entries()) {
      if (key == "image" && value instanceof File) {
        const img = await ImageBasestring64(value);
        productData[key] = img;
      } else {
        productData[key] = typeof value === "string" ? value : String(value);
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
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message; // safe
    }

    return NextResponse.json({ success: false, message });
  }
}
