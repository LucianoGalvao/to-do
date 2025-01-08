// Importando o express
const express = require("express");
// Instanciando o express, chamando de app, para poder realizar as chamadas
const app = express();
// Definindo o número da porta
const PORT = 3000;

// Usando um middleware (intermediário) para processar a requisição
app.use(express.json());

// Setando a rota inicial
app.get("/", (req, res) => {
  res.send("To-Do List API");
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
