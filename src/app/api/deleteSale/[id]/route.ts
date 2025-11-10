import Sale from "@/lib/models/SaleModel";
import { NextResponse } from "next/server";

interface Params {
  params: { id?: string };
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "ID is required",
      }, { status: 400 });
    }

    const deletedSale = await Sale.findByIdAndDelete(id);

    if (!deletedSale) {
      return NextResponse.json({
        success: false,
        message: "Sale not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Sale deleted successfully",
    });
  } catch (error: unknown) {
    let message = "Something went wrong";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
