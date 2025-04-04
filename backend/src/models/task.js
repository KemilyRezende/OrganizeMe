const Sequelize = require("sequelize");
const database = require("../config/db.js");

const Task = database.define("task",{
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
    done:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
});

module.exports = Task;