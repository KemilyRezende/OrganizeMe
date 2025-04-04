require("dotenv").config();
const express = require("express");
const List = require("../models/list"); 

async function getListByID(req, res) {
    const { id } = req.params;

    try {

        const list = await List.findByPk(id);

        if (!list) {
            return res.status(404).json({ error: "Nenhuma lista encontrada com este ID." });
        }

        return res.status(200).json({ message: "Lista encontrada", list });
    } catch (error) {
        res.status(500).json({
            error: "Erro ao buscar Lista",
            detalhes: error.message,
        });
    }
}

module.exports = getListByID;
