const express = require("express");
const cors = require("cors");

const login = require("../controllers/login");
const register = require("../controllers/register");

const getUserLists = require("../controllers/getUserLists");

const createList = require("../controllers/createList");
const concludeList = require("../controllers/concludeList");
const deleteList = require("../controllers/deleteList");

const getListUsers = require("../controllers/getListUsers");

const createTask = require("../controllers/createTask");
const concludeTask = require("../controllers/concludeTask");
const deleteTask = require("../controllers/deleteTask");

const getListTasks = require("../controllers/getListTasks");

const updateTaskConter = require("../controllers/updateTaskCounter");

const createNotification = require("../controllers/createNotification");
const getUserNotifications = require("../controllers/getUserNotifications");
const deleteNotification = require("../controllers/deleteNotification");

const relateUserToList = require("../controllers/relateUserToList");
const deleteRelation = require("../controllers/deleteRelation");

const getUserByEmail = require("../controllers/getUserByEmail");

const getUserByID = require("../controllers/getUserByID");
const getTaskByID = require("../controllers/getTaskByID");
const getListByID = require("../controllers/getListByID");

const router = express.Router();

router.use(cors());

router.use(express.json());

router.post("/login", login);
router.post("/register", register);

router.get("/user-lists/:idUser", getUserLists);

router.post("/create-list", createList);
router.put("/conclude-list/:id/:action", concludeList);
router.delete("/delete-list/:id", deleteList);

router.get("/list-users/:id", getListUsers);

router.get("/list-tasks/:id", getListTasks);

router.put("/update-task-counter/:id/:action", updateTaskConter);

router.post("/create-task", createTask);
router.put("/conclude-task/:id/:action", concludeTask);
router.delete("/delete-task/:id", deleteTask);

router.post("/create-notification", createNotification);
router.get("/user-notifications/:idRecipient", getUserNotifications);
router.delete("/delete-notification/:id", deleteNotification);

router.post("/relate-user-list", relateUserToList);
router.delete("/delete-relation/:idList/:idUser", deleteRelation);

router.get("/get-user-by-email/:email", getUserByEmail)

router.get("/get-user-by-id/:id", getUserByID);
router.get("/get-task-by-id/:id", getTaskByID);
router.get("/get-list-by-id/:id", getListByID);

module.exports = router;