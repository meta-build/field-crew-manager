import mongoose from "mongoose";

const equipmentTypeSchema = new mongoose.Schema({
    value: {
        type: String
    },
});

export default mongoose.model("tipo-equipamentos", equipmentTypeSchema);