import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String
  },

  sobrenome: {
    type: String
  },

  email: {
    type: String
  },

  telefone: {
    type: String
  },

  matricula: {
    type: String
  },

  cpf: {
    type: String
  },

  foto: {
    type: String
  },

  senha: {
    type: String
  },

  isAdmin: {
    type: Boolean
  },

  manobrasAtivas: {
    type: Number
  },
});

export default mongoose.model("usuarios", usuarioSchema);