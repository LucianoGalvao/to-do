const Task = require("../models/taskModel");
const mongoose = require("mongoose");

const createTask = async (req, res) => {
  const { title, description } = req.body;
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
};

const getTasks = async (req, res) => {
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
};

// Rota para buscar uma task por id
const getTaskById = async (req, res) => {
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
};

const updateTask = async (req, res) => {
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
};

const deleteTask = async (req, res) => {
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
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
