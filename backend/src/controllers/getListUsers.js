require("dotenv").config();
const express = require("express");
const Relation = require("../models/relation"); 
const User = require("../models/user"); 
const List = require("../models/list");

async function getListUsers(req, res) {
    const id = parseInt(req.params.id, 10);

    try {

        const list = await List.findOne({
            where: {id},
        });

        if(list){
            const relations = await Relation.findAll({
                where: { idList: id },
                attributes: ["idUser"], 
            });
    
            if (relations.length === 0) {
                return res.status(404).json({ error: "Nenhuma usuário encontrado para essa lista." });
            }
    
            const UserIds = relations.map(relation => relation.idUser);
    
            const users = await User.findAll({
                where: { id: UserIds }, 
                attributes: ["id", "name"]
            });
    
            return res.status(200).json({message: "Usuários encontrados", users});
        }
        else {
            return res.status(404).json({error: "Lista não encontrada"});
        }

        
    } catch (error) {
        res.status(500).json({
            error: "Erro ao buscar os usuários associados a lista",
            detalhes: error.message,
        });
    }
}

module.exports = getListUsers;
