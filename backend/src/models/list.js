const Sequelize = require("sequelize");
const database = require("../config/db.js");

const List = database.define("list",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    description:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    deadline:{
        type: Sequelize.DATE,
        allowNull: true,
    },
    tasks: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    pendencies: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    done: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
});

module.exports = List;