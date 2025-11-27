const loginFunc = async (req, res) => {
    try {
        res.send("Login Func")
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error"
        })
    }
}


module.exports = { loginFunc }