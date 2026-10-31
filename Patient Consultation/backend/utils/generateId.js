const { v4: uuidv4 } = require('uuid');

const generateUserId = () => `user-${uuidv4()}`;
const generateAppointmentId = () => `app-${uuidv4()}`;

module.exports = {
    generateUserId,
    generateAppointmentId
};
