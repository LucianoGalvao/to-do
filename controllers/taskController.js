const Task = require("../models/taskModel");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const createTask = async (req, res) => {
  const { title, description } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
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
  const { page = 1, limit = 10, title, description, status } = req.query;

  const filter = {};

  if (title) {
    filter.title = { $regex: title, $options: "i" }; // Faz ser case sensitive
  }
  if (description) {
    filter.description = { $regex: description, $options: "i" };
  }
  if (status) {
    filter.status = status;
  }

  try {
    const tasks =
      Object.keys(filter).length === 0
        ? await Task.find()
            .skip((page - 1) * limit)
            .limit(limit)
        : await Task.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);
    const totalTasks = await Task.countDocuments(filter);
    if (tasks.length === 0) {
      return res.status(200).json({ status: "Sem tarefas cadastradas" });
    } else {
      res.status(200).json({
        tasks,
        totalPages: Math.ceil(totalTasks / limit),
        currentPage: parseInt(page),
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar tarefas" + err });
  }
};

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
    const task = await Task.findOneAndDelete({ _id: id });
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    res.status(202).json({ message: "Tarefa removida com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar tarefa" + err });
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
