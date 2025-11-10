import { databaseConnection } from "@/lib/dbConfig";
import Cart from "@/lib/models/CartModel";
import { verifyToken } from "@/lib/tokenmanage/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{id:string}> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    await databaseConnection();
    await verifyToken(req);
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Cart id is required.",
      });
    }
    const cartExist = await Cart.findByIdAndDelete(id);
    if (!cartExist) {
      return NextResponse.json({ success: false, message: "Cart not found" });
    }
    return NextResponse.json({
      success: true,
      message: "Cart deleted successfully.",
    });
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ success: false, message });
  }
}
