import mongoose from "mongoose";

const equipamentSchema = new mongoose.Schema({
    tipo: {
        id: String,
        value: String,
    },

    serial: {
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
    },

    latitude: {
        type: Number
    },

    longitude: {
        type: Number
    },
});

export default mongoose.model("equipamentos", equipamentSchema);