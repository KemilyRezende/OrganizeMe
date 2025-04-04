const Sequelize = require("sequelize");
const database = require("../config/db.js");

const Relation = database.define("relation", {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    idList:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    idUser:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = Relation;