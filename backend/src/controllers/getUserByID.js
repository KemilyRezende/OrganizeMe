require("dotenv").config();
const express = require("express");
const User = require("../models/user"); 

async function getUserByID(req, res) {
    const { id } = req.params;

    try {

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: "Nenhum usuário encontrado com este ID." });
        }

        return res.status(200).json({ message: "Usuário encontrado", user });
    } catch (error) {
        res.status(500).json({
            error: "Erro ao buscar o usuário",
            detalhes: error.message,
        });
    }
}

module.exports = getUserByID;
