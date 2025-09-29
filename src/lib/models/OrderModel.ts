import mongoose, { Schema, Types } from "mongoose";
// Product inside each item
interface Product {
  productId: Types.ObjectId;
  productName: string;
}

// Each item in the order
export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface OrderType {
  _id?: string;
  userId?: Types.ObjectId;
  addressId?: Types.ObjectId;
  status?: string;
  paymentMethod?: string;
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
  items: [
    {
      product: { productId: Types.ObjectId; productName: string };
      quantity: number;
      price: number;
    }
  ];
}
const OrderSchema = new Schema<OrderType>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    status: {
      type: String,
      enum: ["pending", "cancelled", "delivered", "confirmed", "shipped"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "CARD", "UPI"],
      default: "COD",
    },
    items: [
      {
        product: {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          productName: {
            type: String,
          },
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
