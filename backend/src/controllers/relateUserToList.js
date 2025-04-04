require("dotenv").config();
const express = require("express");
const Relation = require("../models/relation");
const User = require("../models/user");
const List = require("../models/list");
const jwt = require('jsonwebtoken');

async function relateUserToList(req, res){
    const { idList, idUser} = req.body; 

    try {

        const list = await List.findOne({
            where: {id: idList},
        });

        if (list){
            const user = await User.findOne({
                where: {id: idUser},
            })
            if(user){
                const relation = await Relation.create({
                    idList: idList, 
                    idUser: idUser 
                });
        
                if (relation) {
                    return res.status(201).json({ message: "Relação criada com sucesso" });
                } 
                else {
                    res.status(400).json({ error: "Não foi possível criar a relação" });
                }
            }
            else {
                res.status(404).json({ error: "Usuário não encontrado" });
            }
        }
        else {
            res.status(404).json({ error: "Lista não encontrada" });
        }
    } catch (error) {
        res.status(500).json({
            error: "Erro ao criar relação",
            detalhes: error.message
        });
    }
}

module.exports = relateUserToList;