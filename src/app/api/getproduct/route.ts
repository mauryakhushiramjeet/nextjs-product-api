import { databaseConnection } from "@/lib/dbConfig";
import Product from "@/lib/models/ProductModel";
import { verifyToken } from "@/lib/tokenmanage/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await databaseConnection();
    await verifyToken(req)
    const product = await Product.find();
    return NextResponse.json({
      success: true,
      message: "product geted successfully",
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
