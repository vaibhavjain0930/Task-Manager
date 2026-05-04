const mongoose = require("mongoose");

const url = process.env.MONGO_URL;

const connect = async () => {
  try {
    if (!url) {
      throw new Error("MONGO_URL is missing from environment variables.");
    }
    const response = await mongoose.connect(`${url}`);
    if (response) console.log("Connected successfully to Database.");
  } catch (error) {
    console.log(error);
  }
};

connect();
