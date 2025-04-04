require("dotenv").config();
const express = require("express");
const Notification = require("../models/notification");
const User = require("../models/user");

async function getUserNotifications(req, res) {
    const {idRecipient} = req.params;

    try {

        const user = await User.findByPk(idRecipient);
        if(!user){
            return res.status(400).json({ error: "ID inválido." });
        }

        const notifications = await Notification.findAll({
            where: { idRecipient },
        });

        if (notifications.length === 0) {
            return res.status(204).json({ message: "Nenhuma notificação encontrada para este usuário." });
        }

        return res.status(200).json({message: "Notificações encontradas", notifications});
    } catch (error) {
        res.status(500).json({
            error: "Erro ao buscar as notificações do usuário",
            detalhes: error.message,
        });
    }
}

module.exports = getUserNotifications;
