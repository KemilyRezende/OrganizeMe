require("dotenv").config();
const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/user");
const jwt = require('jsonwebtoken');


async function login(req, res) {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({where: {email}});
        if(!user){
            return res.status(401).json({ error: "Credenciais inválidas!" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(401).json({ error: "Credenciais inválidas!" });
        }

        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
          }, process.env.JWT_SECRET);
          return res
            .status(200)
            .json({ message: "Login bem-sucedido", token });
    } catch (error) {
        res
          .status(500)
          .json({ error: "Erro ao fazer login", detalhes: error.message });
      }
}

module.exports = login;