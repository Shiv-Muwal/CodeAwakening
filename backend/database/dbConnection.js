import mongoose from "mongoose";

export const dbConnection = async () => {
  mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "CodeAwakening",
  })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log("Some error occured while connecting to database:", err);
  });
};
export default dbConnection
