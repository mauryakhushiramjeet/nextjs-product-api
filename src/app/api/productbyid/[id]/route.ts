import { databaseConnection } from "@/lib/dbConfig";
import Product from "@/lib/models/ProductModel";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/tokenmanage/verifyToken";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  // const {id}=await para
  const { id } =params;
  try {
    await databaseConnection();
    await verifyToken(req)
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Product id is required",
      });
    }
    const product = await Product.findById({ _id: id });
    if (!product) {
      return NextResponse.json({
        success: true,
        message: "Product is not found",
      });
    }
    return NextResponse.json({
      success: true,
      message: "product gated successfully",
      product,
    });
  }catch (error: unknown) {
  let message = "Something went wrong";

  if (error instanceof Error) {
    message = error.message; // safe
  }

  return NextResponse.json({ success: false, message });
}

}
