import jwt from "jsonwebtoken";
export const createToken = async (id: string, role: string) => {
  try {
    const token = jwt.sign({ id, role }, process.env.JWT_KEY as string);
    return token;
  } catch (error) {
    console.log(error);
    throw new Error("Token creation failed");
  }
};
