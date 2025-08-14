const jwt = require("jsonwebtoken");
const User = require("../model/User");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Access denied. No token provided." 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token. User not found." 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: "Invalid token." 
        });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ 
            success: false, 
            message: "Access denied. Admin privileges required." 
        });
    }
};

module.exports = { authMiddleware, adminMiddleware };