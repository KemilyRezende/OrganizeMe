require("dotenv").config();
const express = require("express");
const Task = require("../models/task");
const Notification = require("../models/notification");
const jwt = require('jsonwebtoken');
const { combineTableNames } = require("sequelize/lib/utils");

async function deleteTask(req, res) {
    const id = req.params.id;

    try {

        const task = await Task.findByPk(id);
        if(!task){
            return res.status(400).json({ error: "Tarefa não encontrada" });
        }

        await Notification.destroy({
            where: {idTask: id},
        });

        const result = await Task.destroy({
            where: {
                id,
            }
        });

        if (result > 0) {
            return res.status(200).json({ message: "Tarefa apagada com sucesso" });
        }
    } catch (error) {
        res.status(500).json({
            error: "Erro ao apagar a tarefa",
            detalhes: error.message
        });
    }
}

module.exports = deleteTask;