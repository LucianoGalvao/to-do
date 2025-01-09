// Chama o dotenv para as variaveis de ambiente
require("dotenv").config(); // Carregar as variáveis de ambiente
// Importando o express
const express = require("express");
// Instanciando o express, chamando de app, para poder realizar as chamadas
const app = express();
// Definindo o número da porta
const PORT = 3000;
// Importa funçao de DB
const connectDB = require("./db");
const Task = require("./models/tasks");
const mongoose = require("mongoose");

// Conecta ao MongoDB
connectDB();

// Usando um middleware (intermediário) para processar a requisição
app.use(express.json());

// Seta a lista de atividades como um array vazio
let tasks = [];

// Setando a rota inicial
app.get("/", (req, res) => {
  res.send("To-Do List API");
});

// Rota para criacao de uma task
app.post("/tasks", async (req, res) => {
  const { title, description } = req.body;

  // Validacao basica se ha um titulo
  if (!title) {
    return res.status(400).json({ error: 'O campo "title", é obrigatório!' });
  }

  try {
    const newTask = new Task({
      title,
      description,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao salvar a tarefa no banco de dados" });
  }
});

// Rota para listar todas as tasks
app.get("/tasks/", async (req, res) => {
  try {
    const tasks = await Task.find();
    if (tasks.length === 0) {
      return res.status(200).json({ status: "Sem tarefas cadastradas" });
    } else {
      res.status(200).json(tasks);
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
});

// Rota para buscar uma task por id
app.get("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    res.status(200).json(task);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "ID Invalido" });
    } else {
      res.status(500).json({ error: err });
    }
  }
});

// Rota para atualizar uma task
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
});

// Rota para deletar uma task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOneAndDelete(id);
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    res.status(202).json({ message: "Tarefa removida com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar tarefa" });
  }
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
