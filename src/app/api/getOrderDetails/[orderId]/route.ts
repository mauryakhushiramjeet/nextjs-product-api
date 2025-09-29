import { databaseConnection } from "@/lib/dbConfig";
import Order from "@/lib/models/OrderModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
): Promise<NextResponse> {
  const { orderId } = params;

  try {
    await databaseConnection();

    const orderWithAddress = await Order.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(orderId) } },
      { $unwind: "$items" },

      {
        $lookup: {
          from: "products",
          let: { productIdStr: "$items.product.productId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", { $toObjectId: "$$productIdStr" }] },
              },
            },
          ],
          as: "productDetails",
        },
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          "items.productDetails": "$productDetails",
        },
      },

      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          addressId: { $first: "$addressId" },
          status: { $first: "$status" },
          totalAmount: { $first: "$totalAmount" },
          items: { $push: "$items" },
          createdAt: { $first: "$createdAt" },
        },
      },

      {
        $lookup: {
          from: "addresses",
          let: { addrIdStr: "$addressId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", { $toObjectId: "$$addrIdStr" }] },
              },
            },
          ],
          as: "addressDetails",
        },
      },
      {
        $unwind: { path: "$addressDetails", preserveNullAndEmptyArrays: true },
      },

      {
        $lookup: {
          from: "users",
          let: { userIdStr: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", { $toObjectId: "$$userIdStr" }] },
              },
            },
          ],
          as: "userDetails",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 1,
          status: 1,
          totalAmount: 1,
          createdAt: 1,
          items: 1,
          addressDetails: {
            phone: 1,
            address: 1,
            city: 1,
            state: 1,
            country: 1,
            addressType: 1,
          },
          userDetails: { email: 1 },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "OrderDetails retrieved successfully",
      orderWithAddress,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
