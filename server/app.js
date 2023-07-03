const express = require("express");
const dotenv = require("dotenv");
const app = express();

dotenv.config({path:'./config.env'});
require("./db/connection");

const User = require("./model/userSchema");
const Todo = require("./model/todoSchema");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;

// to understand json format
app.use(express.json());
app.use(cookieParser());
// link the routes to make routes easy
app.use(require("./routes/auth"));


app.listen(PORT, (req, res) => {
    console.log(`Server started at port ${PORT}!!`);
});