const mongoose = require("mongoose");

const getDBURL = () => {
    const appMode = process.env.APP_MODE?.toLowerCase();
    let DB_URL;

    if (appMode === "development") {
        DB_URL = process.env.LOCAL_DB_URL;
    } else {
        DB_URL = process.env.DB_URL;
    }

    return DB_URL;
};

const connectDB = async () => {
    try {
        const dbURL = getDBURL();

        if (!dbURL) {
            console.error("❌ Database URL not provided!");
            process.exit(1);
        }

        await mongoose.connect(dbURL);

        console.log(`✅ MongoDB connected in ${process.env.APP_MODE} mode`);
        return `✅ MongoDB connected in ${process.env.APP_MODE} mode`
    } catch (error) {
        console.error("❌ Error in DB Connection:", error.message);
        return `❌ Error in DB Connection: ${error.message}`
        process.exit(1);
    }
};

module.exports = { connectDB };