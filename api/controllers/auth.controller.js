const ApiUser = require("../models/apiusers.model.js")
const asyncHandler = require("../utils/asyncHandler.js");
const { generateToken } = require("../utils/generateToken.js");
const { ErrorResponse, SuccessResponse } = require("../utils/sendingResponse.js");
const bcrypt = require("bcryptjs")

const signupFunc = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    const { username, email, password, projectName } = req.body;
    if (!username || !email || !password || !projectName) throw new ErrorResponse("Required Fields Are Missing", 400);

    const isExists = await ApiUser.findOne({ email });

    if (isExists) throw new ErrorResponse("Email Already Exists", 400)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await ApiUser.create({
        username,
        email,
        password: hashedPassword,
        projectName
    })

    throw new SuccessResponse("User created successfully", {
        username: newUser.username,
        email: newUser.email,
        projectName: newUser.projectName
    }, 201);

})

const loginFunc = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) throw new ErrorResponse("Required fields are missing", 400);

    const user = await ApiUser.findOne({ email });

    if (!user) throw new ErrorResponse("Invalid credentials", 400);

    const matchPassword = await bcrypt.compare(password, user.password)

    if (!matchPassword) throw new ErrorResponse("Invalid credentials", 400);

    const token = generateToken({ _id: user._id, projectName: user.projectName }, process.env.JWT_SECRET, "7d");
    return res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
    });
})


module.exports = { signupFunc, loginFunc }