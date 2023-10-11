import mongoose from "mongoose";

const manobraSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  equipamentos: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
  funcionario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "funcionario", // Referência ao modelo de funcionário
    required: true,
  },
  datetimeInicio: {
    type: Date,
    required: true,
  },
  datetimeFim: {
    type: Date,
  },
});

export default mongoose.model("manobras", manobraSchema);
