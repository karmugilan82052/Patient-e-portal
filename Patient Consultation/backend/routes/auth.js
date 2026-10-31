const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dynamoService = require('../services/dynamoService');
const { generateUserId } = require('../utils/generateId');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const register = async (event) => {
    try {
        const { name, email, password, role, councilId, bloodGroup, allergies, age, gender, emergencyContact } = JSON.parse(event.body);

        // Check if user already exists
        const existingUser = await dynamoService.getUserByEmail(email);
        if (existingUser) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'User already exists' })
            };
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userId = generateUserId();

        const newUser = {
            userId,
            name,
            email,
            passwordHash,
            role,
            councilId,
            bloodGroup: bloodGroup || '',
            allergies: allergies || '',
            age: age || '',
            gender: gender || '',
            emergencyContact: emergencyContact || '',
            createdAt: new Date().toISOString()
        };

        await dynamoService.createUser(newUser);

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User registered successfully' })
        };
    } catch (error) {
        console.error('Register Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

const login = async (event) => {
    try {
        const { email, password } = JSON.parse(event.body);

        const user = await dynamoService.getUserByEmail(email);
        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid credentials' })
            };
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid credentials' })
            };
        }

        const token = jwt.sign(
            { userId: user.userId, email: user.email, role: user.role, name: user.name, councilId: user.councilId },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                token,
                role: user.role,
                userId: user.userId,
                name: user.name,
                councilId: user.councilId,
                bloodGroup: user.bloodGroup || '',
                allergies: user.allergies || '',
                age: user.age || '',
                gender: user.gender || '',
                emergencyContact: user.emergencyContact || ''
            })
        };
    } catch (error) {
        console.error('Login Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

const getProfile = async (event) => {
    try {
        const { userId } = event.user;
        const user = await dynamoService.getUserById(userId);

        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found' })
            };
        }

        // Don't return password hash
        const { passwordHash, ...safeUser } = user;

        return {
            statusCode: 200,
            body: JSON.stringify(safeUser)
        };
    } catch (error) {
        console.error('Get Profile Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

const updateProfile = async (event) => {
    try {
        const { userId } = event.user;
        const { password, councilId, bloodGroup, allergies, age, gender, emergencyContact } = JSON.parse(event.body);
        const updates = {};

        if (password) {
            updates.passwordHash = await bcrypt.hash(password, 10);
        }
        if (councilId) {
            updates.councilId = councilId;
        }
        if (bloodGroup !== undefined) updates.bloodGroup = bloodGroup;
        if (allergies !== undefined) updates.allergies = allergies;
        if (age !== undefined) updates.age = age;
        if (gender !== undefined) updates.gender = gender;
        if (emergencyContact !== undefined) updates.emergencyContact = emergencyContact;

        if (Object.keys(updates).length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'No updates provided' })
            };
        }

        await dynamoService.updateUser(userId, updates);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Profile updated successfully' })
        };
    } catch (error) {
        console.error('Update Profile Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};
