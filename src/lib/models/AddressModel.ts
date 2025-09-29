import mongoose, { Schema, Types } from "mongoose";

export interface addressType {
  _id?: string;
  userId?: Types.ObjectId;
  fullname: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  addressType: string;
  paymentMethod?:string
}
const AddressSchema = new Schema<addressType>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fullname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: "India",
    },
    addressType: {
      type: String,
      enum: ["home", "office", "other"],
      default: "home",
      required: true,
    },
  },
  { timestamps: true }
);
const Address =
  mongoose.models.Address || mongoose.model("Address", AddressSchema);
export default Address;
