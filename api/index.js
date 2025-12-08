const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const { aiAgentSocket } = require("./projetcs/genAI(Invesment)/sockets/chat.socket.js");

const authRouter = require("./routes/auth.route.js");
const { connectDB } = require("./config/db.config.js");
const { projectRoutes } = require("./projetcs/portfolio/routes");
const { responseRouter, chatsRouter } = require("./projetcs/genAI(Invesment)/routes/index.js");
const { originFilter } = require("./config/origin.config.js");
const asyncHandler = require("./utils/asyncHandler.js");
const { errorHandlerMiddleware } = require("./middleware/errorHandler.middleware.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Middleware setup
app.use(cors({
  origin: originFilter,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Database connection once
connectDB();

// ✅ API routes
app.use("/api/auth", authRouter);
app.use("/api/portfolio/project", projectRoutes);
app.use("/api/genAI/investmentAgent", responseRouter);
app.use("/api/genAI/investmentAgent/chat", chatsRouter);

// ✅ Root route
app.get("/", asyncHandler(async (req, res, next) => {
  res.sendFile(path.join(__dirname, "views", "info.html"))
  // throw new SuccessResponse("Express backend Vercel par successfully chal raha hai!");
}));

// ✅ Error middleware
app.use(errorHandlerMiddleware);

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Attach socket.io to same server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Initialize socket events
aiAgentSocket(io);

// ✅ Listen using HTTP server (not app)
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
