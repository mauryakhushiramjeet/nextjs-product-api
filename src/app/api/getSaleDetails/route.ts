import Sale from "@/lib/models/SaleModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const salesDetails = await Sale.find();
    return NextResponse.json({ success: true, salesDetails });
  } catch (error: unknown) {
    let message = "Something went wrong";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ success: false, message: message });
  }
}
