const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authMiddleware = (handler) => {
    return async (event, context) => {
        try {
            const authHeader = event.headers.Authorization || event.headers.authorization;
            if (!authHeader) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: 'Unauthorized: No token provided' })
                };
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);

            event.user = decoded;
            return await handler(event, context);
        } catch (error) {
            console.error('Auth Error:', error);
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Unauthorized: Invalid token' })
            };
        }
    };
};

module.exports = authMiddleware;
