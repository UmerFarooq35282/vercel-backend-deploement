const asyncHandler = require("../../../utils/asyncHandler.js");
const { ErrorResponse, SuccessResponse } = require("../../../utils/sendingResponse.js");
const { Chat } = require("../models/chat.model.js");

const getAllChats = asyncHandler(async (req, res, next) => {
    console.log("Controller Start");

    const userID = req.user._id;
    if (!userID) throw new ErrorResponse("userID required ", 400);

    const chats = await Chat.find({ userId: userID });

    if (!chats) throw new ErrorResponse("Chats not found for user", 404)

    throw new SuccessResponse("All Chats fetched", chats, 200)
    // console.log("Controller End");
})

module.exports = { getAllChats }