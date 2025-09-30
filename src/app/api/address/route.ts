import { databaseConnection } from "@/lib/dbConfig";
import Address, { addressType } from "@/lib/models/AddressModel";
import { verifyToken } from "@/lib/tokenmanage/verifyToken";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { fullname, address, addressType, country, state, phone, city } =
    await req.json();
  try {
    await databaseConnection();
    const tokenId = await verifyToken(req);
    const id = tokenId.id as string;
    if (
      !fullname ||
      !address ||
      !addressType ||
      !country ||
      !state ||
      !phone ||
      !city
    ) {
      return NextResponse.json({
        success: false,
        message: "All field is required.",
        data: {
          fullname,
          address,
          addressType,
          country,
          state,
          phone,
          city,
        },
      });
    }
    const shippingDetailes: addressType = {
      userId: new mongoose.Types.ObjectId(id),
      fullname,
      address,
      addressType,
      country,
      state,
      phone,
      city,
    };
    const addressDetails = new Address(shippingDetailes);
    await addressDetails.save();
    return NextResponse.json({
      success: true,
      message: "Order placed successfully.",
      data: addressDetails,
    });
  }catch (error: unknown) {
  let message = "Something went wrong";

  if (error instanceof Error) {
    message = error.message; // safe
  }

  return NextResponse.json({ success: false, message });
}

}
