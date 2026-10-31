const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const adminRoutes = require('./routes/admin');
const authMiddleware = require('./middleware/authMiddleware');

const handler = async (event, context) => {
    const { path, httpMethod } = event;
    const resource = event.resource;

    console.log(`Request: ${httpMethod} ${path} (Resource: ${resource})`);
    console.log(`Env Check - IS_OFFLINE: ${process.env.IS_OFFLINE}, NODE_ENV: ${process.env.NODE_ENV}`);

    // CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
        'Content-Type': 'application/json'
    };

    if (httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        let response;

        // Auth Routes
        if (resource === '/auth/register' && httpMethod === 'POST') {
            response = await authRoutes.register(event);
        } else if (resource === '/auth/login' && httpMethod === 'POST') {
            response = await authRoutes.login(event);
        } else if (resource === '/auth/profile' && httpMethod === 'GET') {
            response = await authMiddleware(authRoutes.getProfile)(event, context);
        } else if (resource === '/auth/profile' && httpMethod === 'PUT') {
            response = await authMiddleware(authRoutes.updateProfile)(event, context);
        }

        // Appointment Routes (Protected)
        else if (resource === '/appointments' && httpMethod === 'POST') {
            response = await authMiddleware(appointmentRoutes.createAppointment)(event, context);
        } else if (resource === '/appointments/doctor' && httpMethod === 'GET') {
            response = await authMiddleware(appointmentRoutes.getDoctorAppointments)(event, context);
        } else if (resource === '/appointments/patient' && httpMethod === 'GET') {
            response = await authMiddleware(appointmentRoutes.getPatientAppointments)(event, context);
        } else if (resource === '/appointments/{id}' && httpMethod === 'PUT') {
            response = await authMiddleware(appointmentRoutes.updateAppointmentStatus)(event, context);
        }

        // Admin Routes (Protected - Role ADMIN)
        else if (resource === '/admin/stats' && httpMethod === 'GET') {
            response = await authMiddleware(adminRoutes.getStats)(event, context);
        } else if (resource === '/admin/users' && httpMethod === 'GET') {
            response = await authMiddleware(adminRoutes.getUsers)(event, context);
        } else if (resource === '/admin/users/{id}' && httpMethod === 'PUT') {
            response = await authMiddleware(adminRoutes.updateUserRole)(event, context);
        } else if (resource === '/admin/users/{id}' && httpMethod === 'DELETE') {
            response = await authMiddleware(adminRoutes.deleteUser)(event, context);
        } else if (resource === '/admin/appointments' && httpMethod === 'GET') {
            response = await authMiddleware(adminRoutes.getAppointments)(event, context);
        }

        else {
            response = {
                statusCode: 404,
                body: JSON.stringify({ message: 'Route not found' })
            };
        }

        return {
            ...response,
            headers: { ...headers, ...response.headers }
        };
    } catch (error) {
        console.error('Handler Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

module.exports = {
    handler
};
