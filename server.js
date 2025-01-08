// Importando o express
const express = require("express");
// Instanciando o express, chamando de app, para poder realizar as chamadas
const app = express();
// Definindo o número da porta
const PORT = 3000;

// Usando um middleware (intermediário) para processar a requisição
app.use(express.json());

// Seta a lista de atividades como um array vazio
let tasks = [];

// Setando a rota inicial
app.get("/", (req, res) => {
  res.send("To-Do List API");
});

// Rota para criacao de uma task
app.post("/tasks", (req, res) => {
  const { title, description } = req.body;

  // Validacao basica se ha um titulo
  if (!title) {
    return res.status(400).json({ error: 'O campo "title", é obrigatório!' });
  }
  // Inicializador default para as tasks
  const newTask = {
    id: tasks.length + 1,
    title,
    description: description || "",
    status: "Pendente",
    createdAt: new Date(),
  };

  // Adiciona a nova task ao array de tasks
  tasks.push(newTask);

  // Retorna a nova task criada
  res.status(201).json(newTask);
});

// Rota para listar todas as tasks
app.get("/tasks/", (req, res) => {
  res.json(tasks);
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
