import Sale from "@/lib/models/SaleModel";
import { verifyToken } from "@/lib/tokenmanage/verifyToken";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const { role } = await verifyToken(req);

    if (role != "admin") {
      return NextResponse.json(
        { success: false, message: "You are not allow to delete the sale" },
        { status: 400 }
      );
    }
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const sale = await Sale.findByIdAndDelete(id);

    if (!sale) {
      return NextResponse.json(
        { success: false, message: "Sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "sale deleted successfully",
      saleDeletedCount: sale.deletedCount,
    });
  } catch (error: unknown) {
    let message = "Something went wrong";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
