import Sale from "@/lib/models/SaleModel";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    
    const now = new Date();
    const expiredSales = await Sale.deleteMany({
      end: { $lte: now },
    });
    console.log(expiredSales)
      return NextResponse.json({
    success: true,
    message: "Deleted expired sales",
    count: expiredSales.deletedCount,
  });
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ success: false, message });
  }
}
