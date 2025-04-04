require("dotenv").config();
const express = require("express");
const listUser = require("../models/relation");
const jwt = require('jsonwebtoken');

async function deleteRelation(req, res) {
    const { idList, idUser } = req.params;

    try {
        const result = await listUser.destroy({
            where: {
                idList: idList,
                idUser: idUser
            }
        });

        if (result) {
            return res.status(200).json({ message: "Relação apagada com sucesso" });
        } else {
            return res.status(404).json({ error: "Relação não encontrada" });
        }
    } catch (error) {
        res.status(500).json({
            error: "Erro ao apagar a relação",
            detalhes: error.message
        });
    }
}

module.exports = deleteRelation;