require("dotenv").config();
const express = require("express");
const List = require("../models/list");
const jwt = require('jsonwebtoken');


async function concludeList(req, res) {

    const id = parseInt(req.params.id, 10);
    const action = req.params.action;

    try{

        const list = await List.findOne({
            where: {id},
        })
        if(list){
            if(action == "conclude"){
                const result = await List.update(
                    { done: true },
                    { where: {id} }
                );

                if (result[0] > 0) { 
                    return res.status(200).json({ message: "Lista concluída com sucesso" });
                } else {
                    return res.status(404).json({ error: "Lista não encontrada" });
                }
            }
            else{
                const result = await List.update(
                    { done: false },
                    { where: {id} }
                );
                
                if (result[0] > 0) { 
                    return res.status(200).json({ message: "Lista reaberta com sucesso" });
                } else {
                    return res.status(404).json({ error: "Lista não encontrada" });
                }
            }
        }
        else{
            return res.status(404).json({ error: "Lista não encontrada" });
        }

    } catch (error) {
        res.status(500).json({
            error: "Erro concluir lista:",
            detalhes: error.message
        });
    }
}

module.exports = concludeList;