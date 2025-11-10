import { databaseConnection } from "@/lib/dbConfig";
import Cart, { CartSchemaType } from "@/lib/models/CartModel";
import Product from "@/lib/models/ProductModel";
import Sale, { SaleInterface } from "@/lib/models/SaleModel";
import { verifyToken } from "@/lib/tokenmanage/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cardData = await req.json();
  const { userId, productId, quantityQuery } = cardData;
  try {
    await databaseConnection();
    await verifyToken(req);

    if (!productId) {
      return NextResponse.json({
        success: false,
        message: "Product Id is not found",
      });
    }
    const existProduct = await Product.findById(productId);
    const sales = await Sale.find();
    if (!existProduct) {
      return NextResponse.json({
        success: false,
        message: "Product is not exist",
      });
    }
    const related_Product_of_SaleCategory = sales.find(
      (sale) =>
        sale?.category.toLowerCase() === existProduct.category.toLowerCase()
    );

    let finalPrice = existProduct.price;
    if (related_Product_of_SaleCategory) {
      const discount = related_Product_of_SaleCategory?.disccountPercentage || 0;
      const discountedPrice = Math.ceil(
        existProduct.price - (existProduct.price * discount) / 100
      );
      finalPrice = discountedPrice;
      existProduct.price = finalPrice;
    }
    // console.log(
    //   related_Product_of_SaleCategory,
    //   "is here and its price after abstracting discrount is ",
    //   finalPrice,
    //   related_Product_of_SaleCategory.disccountPercentage
    // );
    if (!existProduct.available) {
      return NextResponse.json({
        success: false,
        message: "Product is out of stock",
      });
    }
    const existingCartProduct = await Cart.findOne({ userId, productId });
    if (existingCartProduct) {
      if (quantityQuery) {
        existingCartProduct.quantity -= 1;
        existingCartProduct.total -= finalPrice;
      } else {
        existingCartProduct.quantity += 1;
        existingCartProduct.total += finalPrice;
      }
      await existingCartProduct.save();
      return NextResponse.json({
        success: true,
        data: { existingCartProduct },
      });
    }
    console.log(existingCartProduct);
    // undertand need to change price aacording to sale

    const cartData: CartSchemaType = {
      userId,
      quantityQuery,
      productId,
      productDetailes: existProduct,
      quantity: 1,
      total: finalPrice,
      addedAt: new Date(),
    };

    const cart = new Cart(cartData);
    await cart.save();
    return NextResponse.json({
      success: true,
      message: "Cart added successfully",
      data: cart,
    });
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message; // safe
    }

    return NextResponse.json({ success: false, message });
  }
}
