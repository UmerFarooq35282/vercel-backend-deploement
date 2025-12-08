const express = require("express");
const { addProject, getAllProjects } = require("../controllers");
const { verifyToken } = require("../../../middleware/verifyToken.middleware.js");


const router = express.Router();

router.post("/add", addProject)
router.get("/get" , verifyToken , getAllProjects)

module.exports = router;