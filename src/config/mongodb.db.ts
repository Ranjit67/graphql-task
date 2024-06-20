import mongoose from "mongoose";

export default function MongodbDatabase() {
  mongoose
    .connect(
      "mongodb://admin:admin@mongo-cnt:27017/TaskManagement?directConnection=true&authSource=admin&appName=mongosh+2.2.4"
    )
    .then(function () {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log(`ERROR: ${err}`);
    });
}
