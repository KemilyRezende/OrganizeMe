require("dotenv").config();
const express = require("express");
const Task = require("../models/task");
const List = require("../models/list");
const jwt = require('jsonwebtoken');

async function createTask(req, res){
    const {idList, name, description, deadline} = req.body; 

    try {

        const list = await List.findByPk(idList);
        if(!list){
            return res.status(404).json({ error: "Lista não encontrada." });
        }

        const task = await Task.create({
            idList, name, description, deadline, done: false
        });

        if (task) {
            return res.status(201).json({ message: "Tarefa criada com sucesso", task });
        } 
    } catch (error) {
        res.status(500).json({
            error: "Erro ao criar tarefa",
            detalhes: error.message
        });
    }
}

module.exports = createTask;