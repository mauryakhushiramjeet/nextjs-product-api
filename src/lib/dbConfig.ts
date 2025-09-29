import mongoose from "mongoose";

export const databaseConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://peterapps70_db_user:u2Um08gsTeUKfhZl@cluster0.g0ekjkv.mongodb.net/ecommerce-project?retryWrites=true&w=majority&appName=Cluster0"
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
