import asyncHandler from "../../../utils/asyncHandler.js";
import { Chat } from "../models/chat.model.js";
import { generateAIResponse } from "../utils/aiAgent.helper.js";
import JWT from "jsonwebtoken";

export const aiAgentSocket = (io) => {
  io.on("connection", asyncHandler(async (socket) => {
    try {
      const token = socket.handshake?.auth?.token;
      if (!token) {
        console.log("❌ Token missing, disconnecting socket...");
        socket.disconnect(true);
        return;
      }

      const decoded = JWT.verify(token, process.env.JWT_SECRET);
      const userID = decoded._id;
      console.log("🟢 Socket connected:", socket.id, "User:", userID);

      socket.on("send_message", async ({ chatId, title, text, csvData }) => {
        let chat =
          (chatId && (await Chat.findById(chatId))) ||
          (await Chat.create({ userId: userID, title, messages: [] }));

        chat.messages.push({ role: "user", text });
        await chat.save();

        const aiResponse = await generateAIResponse(text, csvData);

        chat.messages.push({ role: "bot", text: aiResponse.message });
        await chat.save();

        io.to(socket.id).emit("receive_message", {
          chatId: chat._id,
          role: "bot",
          text: aiResponse.message,
          data: aiResponse.data,
          title: aiResponse.title
        });
      });

      socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
      });
    } catch (error) {
      console.error("❌ Socket Auth Error:", error.message);
      socket.disconnect(true);
    }
  }));
};
