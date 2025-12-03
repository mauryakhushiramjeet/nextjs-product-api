import { databaseConnection } from "@/lib/dbConfig";
import Product, { ProductType } from "@/lib/models/ProductModel";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/tokenmanage/verifyToken";
import Sale from "@/lib/models/SaleModel";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  // const {id}=await para
  const { id } = await params;
  try {
    await databaseConnection();
    await verifyToken(req);
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Product id is required",
      });
    }

    const product = await Product.findById({ _id: id }).populate(
      "categoryId",
      "_id categoryName"
    );
    if (!product) {
      return NextResponse.json({
        success: true,
        message: "Product is not found",
      });
    }
    const sales = await Sale.find();
    if (sales.length == 0) {
      return NextResponse.json({
        success: true,
        message: "product gated successfully",
        product,
      });
    }

    let updatedProduct = product.toObject();
    const related_Product_of_SaleCategory = sales.find((sale) =>
      sale?.categoryId.some(
        (catId) => catId.toString() === product.categoryId?._id.toString()
      )
    );
    if (related_Product_of_SaleCategory) {
      const discount = related_Product_of_SaleCategory.disccountPercentage || 0;
      const discountedPrice = Math.ceil(
        product.price - (product.price * discount) / 100
      );
      updatedProduct = {
        ...product.toObject(),
        discountedPrice,
        discount,
        originalPrice: product.price,
      };
    }

    return NextResponse.json({
      success: true,
      message: "product gated successfully",
      product: updatedProduct,
      sales,
    });
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message; // safe
    }

    return NextResponse.json({ success: false, message });
  }
}
