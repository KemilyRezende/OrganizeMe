require("dotenv").config();
const express = require("express");
const List = require("../models/list");
const jwt = require('jsonwebtoken');

async function updateTaskConter(req, res) {
    const {id, action} = req.params;

    try{

        const list = await List.findByPk(id);

        if(!list){
            return res.status(404).json({ error: "Lista não encontrada" });
        }

        if(action === "create"){
            const result = await List.increment(
                { 
                    tasks: 1,
                    pendencies: 1,
                 },
                { where: {id} }
            );
            if(result){ 
                return res.status(200).json({ message: "Pendências e tarefas atualizas" });
            }
        }

        if(action === "conclude"){
            const result = await List.decrement(
                { 
                    pendencies: 1,
                 },
                { where: {id} }
            );
            if(result){ 
                return res.status(200).json({ message: "Pendências atualizas" });
            }
        }
        if(action === "reopen"){
            const result = await List.increment(
                { 
                    pendencies: 1,
                 },
                { where: {id} }
            );
            if(result){ 
                return res.status(200).json({ message: "Pendências atualizas" });
            }
        }
        if(action === "delete"){
            const result = await List.decrement(
                { 
                    tasks: 1,
                    pendencies: 1,
                 },
                { where: {id} }
            );
            if(result){ 
                return res.status(200).json({ message: "Pendências e tarefas atualizas" });
            }
        }
        else{
            return res.status(400).json({ error: "Ação inválida." });
        }

    } catch (error) {
        res.status(500).json({
            error: "Erro atualizar lista:",
            detalhes: error.message
        });
    }
}

module.exports = updateTaskConter;