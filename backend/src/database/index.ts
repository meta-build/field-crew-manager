import mongoose from "mongoose";

const dbUser = process.env.MONGO_USERNAME;
const dbPass = process.env.MONGO_PASS;

const connect = () => {
    mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.mb7m4j2.mongodb.net/imagemapi?retryWrites=true&w=majority`)

    const connection = mongoose.connection;

    connection.on("error", () => {
        console.log("erro ao conectar ao mongodb")
    })

    connection.on("open", () => {
        console.log("conectado ao mongodb")
    })
}

connect();

module.exports = mongoose