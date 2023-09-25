import mongoose from "mongoose";

const equipamentSchema = new mongoose.Schema({
    tipo: {
        type: Number
    },

    serial: {
        type: String
    },

    cidade: {
        type: String
    },

    obs: {
        type: String
    },

    isActive: {
        type: Boolean
    },

    imgs: {
        type: [String]
    }
});

export default mongoose.model("equipamentSchema", equipamentSchema);