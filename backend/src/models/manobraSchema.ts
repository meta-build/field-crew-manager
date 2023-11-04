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
    id: {
      type: String,
      required: true,
    },
    nome: {
      type: String,
      required: true,
    },
    sobrenome: {
      type: String,
      required: true,
    },
  },
  datetimeInicio: {
    type: Date,
    required: true,
  },
  datetimeFim: {
    type: Date,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
});

export default mongoose.model("manobras", manobraSchema);
