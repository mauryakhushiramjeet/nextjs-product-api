import { databaseConnection } from "@/lib/dbConfig";
import Address from "@/lib/models/AddressModel";
import { verifyToken } from "@/lib/tokenmanage/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await databaseConnection();
    const { id } = await verifyToken(req);
    console.log("id is",id);
    const userAddress = await Address.find({ userId: id });
    return NextResponse.json({ success: true, userAddress });
  } catch (error:any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
