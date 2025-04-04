require("dotenv").config();
const express = require("express");
const User = require("../models/user"); 

async function getUserByEmail(req, res) {
    const { email } = req.params;

    try {

        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ error: "Nenhum usuário encontrado com este email." });
        }

        return res.status(200).json({ message: "Usuário encontrado", user });
    } catch (error) {
        res.status(500).json({
            error: "Erro ao buscar o usuário",
            detalhes: error.message,
        });
    }
}

module.exports = getUserByEmail;
