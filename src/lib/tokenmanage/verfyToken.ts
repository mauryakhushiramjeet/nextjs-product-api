import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import User from "../models/UserModel";
export const verfyToken = async (req: NextRequest) => {
  const authHeader=req.headers.get("Authorization")
  const token=authHeader?.split(" ")[1]

  if (!token) throw new Error("token not exist, please login");

  const { payload: tokenDecoded } = await jose.jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_KEY as string)
  );
    console.log("token is",token)

  console.log(tokenDecoded);
  const { id, role } = tokenDecoded;

  console.log("id is", id);
  console.log(role, "role is");
  const user = await User.findById(id);
  if (!user) {
    throw new Error("user not authorized, please login");
  }
  if (role != "admin") {
    throw new Error("Invalide user, please log in with valide email");
  }
  return user;
};
