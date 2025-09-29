import { NextRequest } from "next/server";
import * as jose from "jose";
import User from "../models/UserModel";
export const verifyToken = async (req: NextRequest) => {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];
  console.log(token);
  if (!token) throw new Error("token not exist, please login");

  const { payload: tokenDecoded } = await jose.jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_KEY as string)
  );

  const { id, role } = tokenDecoded;

  const user = await User.findById(id);
  if (!user) {
    throw new Error("user not authorized, please login");
  }
  return { user, role, id };
};
