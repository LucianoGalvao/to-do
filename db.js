const mongoose = require("mongoose");

// URL de conexão ao MongoDB (substitua pela sua string de conexão)
const mongoURI = process.env.MONGODB_URI;

// Função para conectar ao banco de dados
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB conectado com sucesso");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
    process.exit(1); // Encerra o processo em caso de erro
  }
};

module.exports = connectDB;
