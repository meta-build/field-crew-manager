import mongoose from "mongoose";

const equipamentSchema = new mongoose.Schema({
    tipo: {
        type: String
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

export default mongoose.model("equipamentos", equipamentSchema);