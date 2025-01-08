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
  if (tasks.length === 0) {
    return res.status(200).json({ status: "Sem tarefas cadastradas" });
  }
  res.json(tasks);
});

// Rota para buscar uma task por id
app.get("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === parseInt(id));

  // Validacao de task
  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }

  res.json(task);
});

// Rota para atualizar uma task
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const task = tasks.find((t) => t.id === parseInt(id));
  // Validacao
  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }
  // Atualizacao, se ha o dado, substui
  if (title) task.title = title;
  if (description) task.description = description;
  if (status) task.status = status;

  res.json(task);
});

// Rota para deletar uma task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex((t) => t.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
