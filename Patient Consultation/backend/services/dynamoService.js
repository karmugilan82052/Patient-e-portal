const AWS = require('aws-sdk');
const localDb = require('./localDb');

let dynamoDbClient;

const isOffline = () => {
    return (
        process.env.IS_OFFLINE === 'true' ||
        process.env.USE_LOCAL_DB === 'true' ||
        process.env.AWS_SAM_LOCAL ||
        process.env.NODE_ENV === 'development' ||
        !process.env.AWS_LAMBDA_FUNCTION_NAME
    );
};

const getDynamoDb = () => {
    if (!dynamoDbClient) {
        const offline = isOffline();

        const options = offline ? {
            region: 'localhost',
            endpoint: 'http://127.0.0.1:8000',
            accessKeyId: 'fakeMyKeyId',
            secretAccessKey: 'fakeSecretAccessKey'
        } : {};

        if (offline) {
            console.log('[DEBUG] Initializing DynamoDB for Local Dev at http://localhost:8000');
        }

        dynamoDbClient = new AWS.DynamoDB.DocumentClient(options);
    }
    return dynamoDbClient;
};

const USERS_TABLE = process.env.USERS_TABLE;
const APPOINTMENTS_TABLE = process.env.APPOINTMENTS_TABLE;

const dynamoService = {
    async createUser(user) {
        if (isOffline()) {
            return await localDb.createUser(user);
        }
        const params = {
            TableName: USERS_TABLE,
            Item: user
        };
        return await getDynamoDb().put(params).promise();
    },

    async getUserByEmail(email) {
        if (isOffline()) {
            return await localDb.getUserByEmail(email);
        }
        const params = {
            TableName: USERS_TABLE,
            IndexName: 'EmailIndex',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        };
        const result = await getDynamoDb().query(params).promise();
        return result.Items[0];
    },

    async getUserById(userId) {
        if (isOffline()) {
            return await localDb.getUserById(userId);
        }
        const params = {
            TableName: USERS_TABLE,
            Key: { userId }
        };
        const result = await getDynamoDb().get(params).promise();
        return result.Item;
    },

    async getAllUsers() {
        if (isOffline()) {
            return await localDb.getAllUsers();
        }
        const params = {
            TableName: USERS_TABLE
        };
        const result = await getDynamoDb().scan(params).promise();
        return result.Items || [];
    },

    async deleteUser(userId) {
        if (isOffline()) {
            return await localDb.deleteUser(userId);
        }
        const params = {
            TableName: USERS_TABLE,
            Key: { userId }
        };
        return await getDynamoDb().delete(params).promise();
    },

    async createAppointment(appointment) {
        if (isOffline()) {
            return await localDb.createAppointment(appointment);
        }
        const params = {
            TableName: APPOINTMENTS_TABLE,
            Item: appointment
        };
        return await getDynamoDb().put(params).promise();
    },

    async getAppointmentsByUser(userId) {
        if (isOffline()) {
            return await localDb.getAppointmentsByUser(userId);
        }
        const params = {
            TableName: APPOINTMENTS_TABLE,
            IndexName: 'UserIdIndex',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        };
        console.log(`[QUERY] Fetching history for userId: ${userId}`);
        const result = await getDynamoDb().query(params).promise();
        return result.Items;
    },

    async getAllAppointments() {
        if (isOffline()) {
            return await localDb.getAllAppointments();
        }
        const params = {
            TableName: APPOINTMENTS_TABLE
        };
        const result = await getDynamoDb().scan(params).promise();
        return result.Items || [];
    },

    async updateUser(userId, updates) {
        if (isOffline()) {
            return await localDb.updateUser(userId, updates);
        }
        const updateExpression = [];
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};

        if (updates.name) {
            updateExpression.push('#name = :name');
            expressionAttributeValues[':name'] = updates.name;
            expressionAttributeNames['#name'] = 'name';
        }
        if (updates.role) {
            updateExpression.push('#role = :role');
            expressionAttributeValues[':role'] = updates.role;
            expressionAttributeNames['#role'] = 'role';
        }
        if (updates.passwordHash) {
            updateExpression.push('passwordHash = :pw');
            expressionAttributeValues[':pw'] = updates.passwordHash;
        }
        if (updates.councilId) {
            updateExpression.push('councilId = :councilId');
            expressionAttributeValues[':councilId'] = updates.councilId;
        }
        if (updates.bloodGroup !== undefined) {
            updateExpression.push('bloodGroup = :bloodGroup');
            expressionAttributeValues[':bloodGroup'] = updates.bloodGroup;
        }
        if (updates.allergies !== undefined) {
            updateExpression.push('allergies = :allergies');
            expressionAttributeValues[':allergies'] = updates.allergies;
        }
        if (updates.age !== undefined) {
            updateExpression.push('age = :age');
            expressionAttributeValues[':age'] = updates.age;
        }
        if (updates.gender !== undefined) {
            updateExpression.push('gender = :gender');
            expressionAttributeValues[':gender'] = updates.gender;
        }
        if (updates.emergencyContact !== undefined) {
            updateExpression.push('emergencyContact = :emergencyContact');
            expressionAttributeValues[':emergencyContact'] = updates.emergencyContact;
        }

        if (updateExpression.length === 0) return;

        const params = {
            TableName: USERS_TABLE,
            Key: { userId },
            UpdateExpression: `set ${updateExpression.join(', ')}, updatedAt = :updatedAt`,
            ExpressionAttributeValues: {
                ...expressionAttributeValues,
                ':updatedAt': new Date().toISOString()
            },
            ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
            ReturnValues: 'ALL_NEW'
        };

        return await getDynamoDb().update(params).promise();
    },

    async getAppointmentsByCouncil(councilId) {
        if (isOffline()) {
            return await localDb.getAppointmentsByCouncil(councilId);
        }
        const params = {
            TableName: APPOINTMENTS_TABLE,
            IndexName: 'CouncilIdIndex',
            KeyConditionExpression: 'councilId = :councilId',
            ExpressionAttributeValues: {
                ':councilId': councilId
            }
        };
        console.log(`[QUERY] Fetching for councilId: ${councilId} using Index: CouncilIdIndex`);
        const result = await getDynamoDb().query(params).promise();
        console.log(`[QUERY_RESULT] Found ${result.Items.length} appointments`);
        return result.Items;
    },

    async getAppointmentById(appointmentId) {
        if (isOffline()) {
            return await localDb.getAppointmentById(appointmentId);
        }
        const params = {
            TableName: APPOINTMENTS_TABLE,
            Key: { appointmentId }
        };
        const result = await getDynamoDb().get(params).promise();
        return result.Item;
    },

    async updateAppointmentStatus(appointmentId, status, appointmentDateTime, doctorId) {
        if (isOffline()) {
            return await localDb.updateAppointmentStatus(appointmentId, status, appointmentDateTime, doctorId);
        }
        let updateExpression = 'set #s = :status, updatedAt = :updatedAt';
        let expressionAttributeValues = {
            ':status': status,
            ':updatedAt': new Date().toISOString()
        };
        let expressionAttributeNames = {
            '#s': 'status'
        };

        if (appointmentDateTime) {
            updateExpression += ', appointmentDateTime = :dateTime';
            expressionAttributeValues[':dateTime'] = appointmentDateTime;
        }

        if (doctorId) {
            updateExpression += ', doctorId = :doctorId';
            expressionAttributeValues[':doctorId'] = doctorId;
        }

        const params = {
            TableName: APPOINTMENTS_TABLE,
            Key: { appointmentId },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues
        };
        return await getDynamoDb().update(params).promise();
    }
};

module.exports = dynamoService;
