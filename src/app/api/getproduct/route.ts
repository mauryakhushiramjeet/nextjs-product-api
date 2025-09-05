import { databaseConnection } from "@/lib/dbConfig";
import Product from "@/lib/models/ProductModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
  try {
    await databaseConnection();
    // await verfyToken(req)
    const product = await Product.find();
    return NextResponse.json({
      success: true,
      message: "product geted successfully",
      product,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message, error });
  }
}
