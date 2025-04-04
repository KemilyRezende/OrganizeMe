require("dotenv").config();
const express = require("express");
const List = require("../models/list");
const Relation = require("../models/relation");
const Notification = require("../models/notification");
const Task = require("../models/task");
const jwt = require('jsonwebtoken');

async function deleteList(req, res) {
    const id = req.params.id;
    try {

        const list = await List.findByPk(id);
        if(!list){
            return res.status(404).json({ error: "Lista não encontrada" });
        }

        const relationsCount = await Relation.count({
            where: {
                idList: id
            }
        });

        if(relationsCount > 0){
            return res.status(400).json({message: "A lista não foi excluída pois está associada a outro usuário"})
        }

        await Notification.destroy({
            where: {
                idList: id
            }
        });

        await Task.destroy({
            where: {
                idList: id
            }
        });

        const result = await List.destroy({
            where: {
                id
            }
        });

        if (result) {
            return res.status(200).json({ message: "Lista apagada com sucesso" });
        }

    } catch (error) {
        res.status(500).json({
            error: "Erro ao apagar Lista",
            detalhes: error.message
        });
    }
}



module.exports = deleteList;