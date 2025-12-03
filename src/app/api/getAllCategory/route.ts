import Category from "@/lib/models/CategoryModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const category = await Category.find();
    return NextResponse.json({
      success: true,
      message: "Get all category successfull",
      data: category,
    });
  } catch (error) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ success: false, message });
  }
}
