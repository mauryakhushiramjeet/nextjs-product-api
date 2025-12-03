import Sale, { SaleInterface } from "@/lib/models/SaleModel";
import { NextRequest, NextResponse } from "next/server";
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import Category from "@/lib/models/CategoryModel";
import mongoose from "mongoose";
cloudinary.config({
  cloud_name: "dbjudi79x",
  api_key: "131821544321787",
  api_secret: "ZClF1kMwL8HShRssgI33Pa9gYu4",
});
const now = new Date();
const endDate = new Date();
endDate.setDate(now.getDate() + 30);
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const image = formData.get("image") as File;
  const name = formData.get("name") as string;
  const categoryId = formData.getAll("categoryId");
  const disccountPercentage = formData.get("disccountPercentage") as string;

  try {
    if (!image || !name || !disccountPercentage || categoryId.length == 0) {
      return NextResponse.json({
        success: false,
        message: "All fileds are required",
      });
    }
    const isCategoryValid = await Promise.all(
      categoryId.map(async (id) => {
        const category = await Category.findById(id);
        return !!category;
      })
    );
    const existingCategories: string[] = [];
    for (const id of categoryId) {
      const sale = await Sale.findOne({
        categoryId: id,
      }).populate("categoryId", "categoryName _id");

      if (sale) {
        const matched = sale.categoryId.find(
          (cat) => cat._id.toString() === id
        );

        if (matched) {
          existingCategories.push(matched.categoryName);
        }
      }
    }

    if (existingCategories.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Sale already exists for: ${existingCategories.join(", ")}`,
      });
    }

    if (isCategoryValid.includes(false)) {
      return NextResponse.json({
        success: false,
        message: "categories are invalid",
      });
    }

    console.log(categoryId, "category id");
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: "sale" },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error) return reject(error);
            if (result) return resolve(result);
            reject(new Error("Upload failed"));
          }
        );

        upload.end(buffer);
      }
    );
    const categoryIds = categoryId.map(
      (id) => new mongoose.Types.ObjectId(id as string)
    );
    const saleCreated: SaleInterface = await Sale.create({
      image: uploadResult.secure_url,
      name,
      categoryId: categoryIds,
      disccountPercentage,
      start: now,
      end: endDate,
    });
    return NextResponse.json({
      success: true,
      message: "Sale created successfully",
      saleCreated,
    });
  } catch (error: unknown) {
    let message = "Something went wronng";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ success: false, message });
  }
}
