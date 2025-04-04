require("dotenv").config();
const express = require("express");
const Task = require("../models/task");
const jwt = require('jsonwebtoken');


async function concludeTask(req, res) {
    const {id, action} = req.params;

    try{

        if(action === "conclude"){
            const result = await Task.update(
                { done: true },
                { where: {id} }
            );
            if (result > 0) { 
                return res.status(200).json({ message: "Tarefa concluída com sucesso" });
            } else {
                return res.status(404).json({ error: "Tarefa não encontrada" });
            }
        }
        else{
            const result = await Task.update(
                { done: false },
                { where: {id} }
            );
            if (result > 0) { 
                return res.status(200).json({ message: "Tarefa reaberta com sucesso" });
            } else {
                return res.status(404).json({ error: "Tarefa não encontrada" });
            }
        }

    } catch (error) {
        res.status(500).json({
            error: "Erro concluir tarefa:",
            detalhes: error.message
        });
    }
}

module.exports = concludeTask;