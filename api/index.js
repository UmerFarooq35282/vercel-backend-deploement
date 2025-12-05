const express = require("express");
const authRouter = require("./routes/auth.route.js");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db.config.js");
const { projectRoutes } = require("./projetcs/portfolio/routes");
const { responseRouter } = require("./projetcs/genAI(Invesment)/routes/index.js");
const cors = require("cors");
const { originFilter } = require("./config/origin.config.js");
const { SuccessResponse, ErrorResponse } = require("./utils/sendingResponse.js");
const asyncHandler = require("./utils/asyncHandler.js");
const { errorHandlerMiddleware } = require("./middleware/errorHandler.middleware.js");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080

app.use(cors({
  origin: originFilter,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

connectDB();

app.use("/api/auth", authRouter)
app.use("/api/portfolio/project", projectRoutes)
app.use("/api/genAI/investmentAgent", responseRouter)

app.get("/", asyncHandler(async (req, res, next) => {
  const connectionResponse = await connectDB();
  throw new SuccessResponse(`Express backend Vercel par successfully chal raha hai! ${connectionResponse}`)
}));

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log("App is running on port ", PORT)
})

module.exports = app;
