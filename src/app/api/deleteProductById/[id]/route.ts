import { databaseConnection } from "@/lib/dbConfig";
import Product from "@/lib/models/ProductModel";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    await databaseConnection();
    if (!id) {
      return NextResponse.json({
        success: false,
        mesage: "Product id is required",
      });
    }
    // if()
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
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message; // safe
    }

    return NextResponse.json({ success: false, message });
  }
}
