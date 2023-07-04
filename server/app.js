const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const app = express();

dotenv.config({path:'./config.env'});
require("./DB/connection");

const User = require("./model/userSchema");
const Todo = require("./model/todoSchema");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;

app.use(cors());
// to understand json format
app.use(express.json());
app.use(cookieParser());
// link the routes to make routes easy
app.use(require("./routes/auth"));


app.listen(PORT, (req, res) => {
    console.log(`Server started at port ${PORT}!!`);
});