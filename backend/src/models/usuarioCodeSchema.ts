import mongoose from "mongoose";

const usuarioCodeSchema = new mongoose.Schema({
    usuario: {
        type: String
    },
    codigo: {
        type: String
    },
});

export default mongoose.model("usuadio-codigo", usuarioCodeSchema);