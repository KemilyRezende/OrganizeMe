require("dotenv").config();
const express = require("express");
const Task = require("../models/task");
const List = require("../models/list");

async function getListTasks(req, res) {
    const id = parseInt(req.params.id, 10);

    try {

        const list = await List.findOne({
            where: {id},
        });

        if(list){
            const tasks = await Task.findAll({
                where: { idList:id },
            });
    
            if (tasks.length === 0) {
                return res.status(204).json({ message: "Nenhuma tarefa encontrada para esta lista." });
            }
    
            return res.status(200).json({message: "Tarefas encontradas", tasks});
        }
        else{
            return res.status(400).json({ error: "Lista não encontrada" });
        }

    } catch (error) {
        res.status(500).json({
            error: "Erro ao buscar as tarefas da lista",
            detalhes: error.message,
        });
    }
}

module.exports = getListTasks;
