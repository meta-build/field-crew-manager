import mongoose from "mongoose";

const dbUrl = process.env.MONGO_URL;

const connect = () => {
  mongoose.connect(dbUrl);

  const connection = mongoose.connection;

  connection.on("error", () => {
    console.log("erro ao conectar ao mongodb")
  });

  connection.on("open", () => {
    console.log("conectado ao mongodb")
  });
}

connect();

module.exports = mongoose;