import Category from "@/lib/models/CategoryModel";
import { verifyToken } from "@/lib/tokenmanage/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { categoryName } = await req.json();
  try {
    const { role } = await verifyToken(req);
    // console.log(role);
    
    if (role !== "admin") {
      return NextResponse.json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }
    if (!categoryName) {
      return NextResponse.json({
        success: false,
        message: "Category name is required.",
      });
    }
    const isCategoryExist = await Category.findOne({ categoryName });
    if (isCategoryExist) {
      return NextResponse.json({
        success: false,
        message: "Category already exists",
      });
    }
    const category = await Category.create({ categoryName });
    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ success: false, message });
  }
}
