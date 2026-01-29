const mongoose = require("mongoose");

const url = process.env.MONGO_URL;

const connect = async () => {
  try {
    const response = await mongoose.connect(`${url}`);
    if (response) console.log("Connected successfully to Database.");
  } catch (error) {
    console.log(error);
  }
};

connect();
