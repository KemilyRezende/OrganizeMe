require("dotenv").config();
const express = require("express");
const Notification = require("../models/notification");
const User = require("../models/user");
const List = require("../models/list");
const Task = require("../models/task");
const jwt = require('jsonwebtoken');

async function createNotification(req, res){
    const {type, idList, idSender, idRecipient, idTask } = req.body; 

    try {

        const sender = await User.findOne({
            where: {id: idSender},
        });

        if(sender){
            const list = await List.findOne({
                where: {id: idList},
            });

            if(list){
                const recipient = await User.findOne({
                    where: {id: idRecipient},
                });

                if(recipient){
                    if (type > 0 && type < 8){
                        if(idTask == null){
                            const notification = await Notification.create({
                                type, idList, idSender, idRecipient, idTask
                            });
                    
                            if (notification) {
                                return res.status(201).json({ message: "Notificação enviada com sucesso" });
                            } else {
                                res.status(400).json({ error: "Não foi possível criar a notificação" });
                            }
                        }
                        else{
                            const task = await Task.findOne({
                                where: {id: idTask},
                            });
    
                            if(task){
                                const notification = await Notification.create({
                                    type, idList, idSender, idRecipient, idTask
                                });
                        
                                if (notification) {
                                    return res.status(201).json({ message: "Notificação enviada com sucesso" });
                                } 
                            }
                            else{
                                res.status(404).json({ error: "A tarefa não foi encontrada" });
                            }
                        }
                    }
                    else{
                        res.status(406).json({ error: "Tipo de notificação inválido" });
                    }
                }
                else{
                    res.status(404).json({ error: "O usuário destinatário não foi encontrado" });
                }
            }
            else{
                res.status(404).json({ error: "A lista não foi encontrada" });
            }
        }
        else {
            res.status(404).json({ error: "O usuário remetente não foi encontrado" });
        }
    } catch (error) {
        res.status(500).json({
            error: "Erro ao criar notificação",
            detalhes: error.message
        });
    }
}

module.exports = createNotification;