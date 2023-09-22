import mongoose from "mongoose";

const equipamentSchema = new mongoose.Schema({
    Tipo: {
        type: String,
        require: true,
    },

    Serial: {
        type: String,
        require: true
    },

    Cidade: {
        type: String,
        require: true
    },

    OBS: {
        type: String,
        require: true
    }
});

export default mongoose.model("equipamentSchema", equipamentSchema);