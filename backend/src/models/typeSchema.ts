import mongoose from "mongoose";

const typeSchema = new mongoose.Schema({
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

export default mongoose.model("typeSchema", typeSchema);