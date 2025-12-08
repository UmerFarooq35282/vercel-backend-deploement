const express = require("express");
const { verifyToken } = require("../../../middleware/verifyToken.middleware.js");
const { getAllChats } = require("../controllers/chats.controller.js");

const router = express.Router();

router.get("/get" , verifyToken , getAllChats);

module.exports = router