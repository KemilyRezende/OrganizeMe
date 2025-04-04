require("dotenv").config();
const express = require("express");
const Task = require("../models/task"); 

async function getTaskByID(req, res) {
    const { id } = req.params;

    try {

        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ error: "Nenhuma tarefa encontrada com este ID." });
        }

        return res.status(200).json({ message: "Tarefa encontrada", task });
    } catch (error) {
        res.status(500).json({
            error: "Erro ao buscar tarefa",
            detalhes: error.message,
        });
    }
}

module.exports = getTaskByID;
