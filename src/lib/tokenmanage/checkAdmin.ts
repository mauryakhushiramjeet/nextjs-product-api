import { verifyToken } from "./verifyToken";
import { NextRequest } from "next/server";

export const checkAdmin = async (req: NextRequest) => {
  const { user, role } = await verifyToken(req);

  if (role !== "admin") {
    throw new Error("Invalid user, please log in with admin account");
  }

  return user;
};
