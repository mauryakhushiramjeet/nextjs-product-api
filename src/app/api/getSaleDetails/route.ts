import Sale from "@/lib/models/SaleModel";
import { NextResponse } from "next/server";
import Category from "@/lib/models/CategoryModel";

export async function GET() {
  try {
    const sales = await Sale.find().populate({
      path: "categoryId",
      select: "categoryName _id",
      model: Category,
    });
    return NextResponse.json({ success: true, sales });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
}
