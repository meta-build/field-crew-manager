import mongoose from "mongoose";

const equipamentSchema = new mongoose.Schema({
    tipo: {
        type: Number,
        require: true,
    },

    serial: {
        type: String,
        require: true
    },

    cidade: {
        type: String,
        require: true,
    },

    obs: {
        type: String,
        require: true,
    }
});

export default mongoose.model("equipamentSchema", equipamentSchema);