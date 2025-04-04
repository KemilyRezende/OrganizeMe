require("dotenv").config();
const express = require("express");
const Relation = require("../models/relation"); 
const User = require("../models/user");
const List = require("../models/list"); 

async function getUserLists(req, res) {
    const { idUser } = req.params;

    try {

        const user = await User.findByPk(idUser);
        if(!user){
            return res.status(400).json({ error: "ID inválido." });
        }

        const relations = await Relation.findAll({
            where: { idUser },
            attributes: ["idList"],
        });

        if (relations.length === 0) {
            return res.status(204).json({ message: "Nenhuma lista encontrada para este usuário." });
        }

        const listIds = relations.map(relation => relation.idList);

        const lists = await List.findAll({
            where: { id: listIds }, 
        });

        return res.status(200).json({message: "Listas encontradas", lists});
    } catch (error) {
        res.status(500).json({
            error: "Erro ao buscar as listas do usuário",
            detalhes: error.message,
        });
    }
}

module.exports = getUserLists;
