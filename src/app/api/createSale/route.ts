import Sale, { SaleInterface } from "@/lib/models/SaleModel";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
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
  const category = formData.get("category") as string;
  const disccountPercentage = formData.get("disccountPercentage") as string;

  try {
    if (!image || !name || !category || !disccountPercentage) {
      return NextResponse.json({
        success: false,
        message: "All fileds are required",
      });
    }
    const arrayBuffer = await image.arrayBuffer(); //Read data as binary formate like 10 2s 3p 4d like this
    const buffer = Buffer.from(arrayBuffer); //node js do not undertand array buffrre  so here conver arrayBuffer in nodejs read friendly formates
   
const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
  const upload = cloudinary.uploader.upload_stream(
    { folder: "sale" },
    (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
      if (error) return reject(error);
      if (result) return resolve(result);
      reject(new Error("Upload failed"));
    }
  );

  upload.end(buffer);
});
    const saleCreated: SaleInterface = await Sale.create({
      image: uploadResult.secure_url,
      name,
      category,
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
