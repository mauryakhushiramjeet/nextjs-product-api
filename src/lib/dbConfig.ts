import mongoose from "mongoose";

export const databaseConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/ecommerce-project?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.6"
    );
    mongoose.connection.on("connect", () => {
      console.log("data base connected successfully");
    });
    mongoose.connection.on("error", () => {
      console.log("Filed to connection with database");
    });
  } catch (error) {
    console.log(error);
  }
};
