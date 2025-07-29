const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'No token provided or token is malformed.',
                success: false
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

     
        req.user = decoded;

        next(); 
    } catch (error) {
        console.error("Token Verification Error:", error)
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

module.exports = verifyToken;
