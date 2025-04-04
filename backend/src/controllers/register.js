require("dotenv").config();
const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/user");
const jwt = require('jsonwebtoken');


async function register(req, res) {
  const { name, email, password} = req.body;

  try {

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashPassword});

    // Verifica se o usuário foi cadastrado com sucesso
    if (newUser) {
      const token = jwt.sign({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }, process.env.JWT_SECRET);
      return res.status(201).json({
        message: "Usuário cadastrado com sucesso",
        token,
      });
    } else {
      res.status(400).json({ error: "Não foi possível cadastrar o usuário" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao cadastrar usuário", detalhes: error.message });
  }
}

module.exports = register;