const jwt = require('jsonwebtoken');
const Counselor = require('../models/Counselor');

const counselorAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const counselor = await Counselor.findById(decoded.id);
        if (!counselor) {
            return res.status(403).json({ message: 'Access denied. Not a counselor.' });
        }

        req.user = counselor;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = counselorAuth;