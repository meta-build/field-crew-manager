import mongoose from "mongoose";

const funcionarioSchema = new mongoose.Schema({
  nome: {
    type: String,
  },
  sobrenome: {
    type: String,
  },
});

export default mongoose.model("funcionario", funcionarioSchema);