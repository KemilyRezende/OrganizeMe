require("dotenv").config();
const express = require("express");
const Notification = require("../models/notification");
const jwt = require('jsonwebtoken');

async function deleteNotification(req, res) {
    const id = req.params.id;
    try {

        const result = await Notification.destroy({
            where: {
                id,
            }
        });

        if (result) {
            return res.status(200).json({ message: "Notificação apagada com sucesso" });
        } else {
            return res.status(404).json({ error: "Notificação não encontrada" });
        }

    } catch (error) {
        res.status(500).json({
            error: "Erro ao apagar Notificação",
            detalhes: error.message
        });
    }
}



module.exports = deleteNotification;