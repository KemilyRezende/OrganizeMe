require("dotenv").config();
const express = require("express");
const List = require("../models/list");
const jwt = require('jsonwebtoken');

async function createList(req, res) {
    const {name, description, deadline} = req.body;
    try{
        const newList = await List.create({name, description, deadline, tasks: 0, pendencies: 0, done: false});
        if (newList) {
              return res.status(201).json({
                message: "Lista criada com sucesso",
                list: newList,
              });
            } else {
              res.status(400).json({ error: "Não foi possível criar a Lista" });
            }
    } catch (error) {
        res
          .status(500)
          .json({ error: "Erro ao criar Lista", detalhes: error.message });
      }
}

module.exports = createList;