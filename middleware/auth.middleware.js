const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const auth = async  (req, res, next) => {
    try {
        const authHeader = req?.headers?.authorization;
        if (!authHeader) {
            return res.status(401).send("Access Denied: No token provided");
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        if (!decoded) {
            return res.status(401).send("Access Denied: Invalid token");
        }

        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        req.user = user;  // Use req instead of res for attaching the user
        next();
    } catch (error) {
        res.status(403).json({ Msg: "Access Denied", Error: error.message });
    }
};

module.exports = auth;
