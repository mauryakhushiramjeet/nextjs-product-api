import { databaseConnection } from "@/lib/dbConfig";
import Product from "@/lib/models/ProductModel";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    await databaseConnection();
    if (!id) {
      return NextResponse.json({
        success: false,
        mesage: "Product id is required",
      });
    }
    const product = await Product.findByIdAndDelete({ _id: id });
    if (!product) {
      return NextResponse.json({
        success: false,
        mesage: `No product found with ID: ${id}`,
      });
    }
    return NextResponse.json({
      success: true,
      message: "product deleted successfully",
      product,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message, error });
  }
}
