const Sequelize = require("sequelize");
const database = require("../config/db.js");

const Notification = database.define("notification", {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    type:{
        type: Sequelize.INTEGER,
        allowNull: false,
        /*
        1 - Convite para participar de uma Lista.
        2 - Novo usuário se juntou a uma Lista.
        3 - Remoção de usuário de uma Lista.
        4 - Lista concluída.
        5 - Nova tarefa adicionada a uma Lista.
        6 - Tarefa concluída.
        7 - Tarefa removida.
         */
    },
    idList:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    idSender:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    idRecipient:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    idTask:{
        type: Sequelize.INTEGER,
        allowNull: true,
    }, 
});


module.exports = Notification;