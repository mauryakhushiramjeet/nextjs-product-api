import { databaseConnection } from "@/lib/dbConfig";
import Product from "@/lib/models/ProductModel";
import { verfyToken } from "@/lib/tokenmanage/verfyToken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const FormData = await req.formData();

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
    FormData.forEach((value, key) => {
      productData[key] = value;
    });
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
  } catch (error:any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
