import mongoose from "mongoose";
const config = require("../config/config.js");
const configuration = config.default[process.env.NODE_ENV];
const db = configuration.DB;
const MONGO_url = `mongodb://localhost:${db.DB_PORT}/${db.DB_NAME}`;

const connnectDb = async () => {
  try {
    await mongoose.connect(MONGO_url);

    console.log("DB is connected");
  } catch (error) {
    console.log("error while connecting to db");
  }
};

module.exports = connnectDb;
