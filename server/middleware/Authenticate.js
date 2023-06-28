const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const userData = await User.findOne({_id:verifyToken._id, "tokens.token" : token});

        if(!userData) {
            throw new Error("User not found!");
        }

        req.token = token;
        req.userData = userData;
        req.userId = userData._id;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).send("Unauthorized user");
    }
}

module.exports = authenticate;