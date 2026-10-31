const dynamoService = require('../services/dynamoService');

const checkAdmin = (user) => {
    return user && user.role === 'ADMIN';
};

const getStats = async (event) => {
    try {
        if (!checkAdmin(event.user)) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Forbidden: Admin access required' })
            };
        }

        const users = await dynamoService.getAllUsers();
        const appointments = await dynamoService.getAllAppointments();

        const totalUsers = users.length;
        const totalPatients = users.filter(u => u.role === 'USER').length;
        const totalDoctors = users.filter(u => u.role === 'DOCTOR').length;
        const totalAdmins = users.filter(u => u.role === 'ADMIN').length;

        const totalAppointments = appointments.length;
        const pendingAppointments = appointments.filter(a => a.status === 'PENDING').length;
        const confirmedAppointments = appointments.filter(a => a.status === 'CONFIRMED').length;
        const totalRevenue = confirmedAppointments * 200;

        // Council breakdown
        const councilMap = {};
        appointments.forEach(app => {
            const c = app.councilId || 'Other';
            if (!councilMap[c]) councilMap[c] = { name: c, total: 0, pending: 0, confirmed: 0 };
            councilMap[c].total++;
            if (app.status === 'PENDING') councilMap[c].pending++;
            if (app.status === 'CONFIRMED') councilMap[c].confirmed++;
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                totalUsers,
                totalPatients,
                totalDoctors,
                totalAdmins,
                totalAppointments,
                pendingAppointments,
                confirmedAppointments,
                totalRevenue,
                councilBreakdown: Object.values(councilMap)
            })
        };
    } catch (error) {
        console.error('Admin getStats error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

const getUsers = async (event) => {
    try {
        if (!checkAdmin(event.user)) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Forbidden: Admin access required' })
            };
        }

        const users = await dynamoService.getAllUsers();
        const safeUsers = users.map(({ passwordHash, ...u }) => u);

        return {
            statusCode: 200,
            body: JSON.stringify(safeUsers)
        };
    } catch (error) {
        console.error('Admin getUsers error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

const updateUserRole = async (event) => {
    try {
        if (!checkAdmin(event.user)) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Forbidden: Admin access required' })
            };
        }

        const { id } = event.pathParameters;
        const { role, councilId } = JSON.parse(event.body);

        const updates = {};
        if (role) updates.role = role;
        if (councilId) updates.councilId = councilId;

        await dynamoService.updateUser(id, updates);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User updated successfully' })
        };
    } catch (error) {
        console.error('Admin updateUserRole error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

const deleteUser = async (event) => {
    try {
        if (!checkAdmin(event.user)) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Forbidden: Admin access required' })
            };
        }

        const { id } = event.pathParameters;
        if (id === event.user.userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Cannot delete your own active administrator account' })
            };
        }

        await dynamoService.deleteUser(id);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User deleted successfully' })
        };
    } catch (error) {
        console.error('Admin deleteUser error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

const getAppointments = async (event) => {
    try {
        if (!checkAdmin(event.user)) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Forbidden: Admin access required' })
            };
        }

        const appointments = await dynamoService.getAllAppointments();
        const users = await dynamoService.getAllUsers();
        const userMap = {};
        users.forEach(u => {
            userMap[u.userId] = u;
        });

        const enrichedAppointments = appointments.map(app => {
            const patient = userMap[app.userId];
            const doctor = app.doctorId ? userMap[app.doctorId] : null;
            return {
                ...app,
                patientName: patient ? patient.name : 'Unknown',
                patientEmail: patient ? patient.email : '',
                doctorName: doctor ? doctor.name : null,
                bloodGroup: patient ? patient.bloodGroup : '',
                allergies: patient ? patient.allergies : ''
            };
        });

        return {
            statusCode: 200,
            body: JSON.stringify(enrichedAppointments)
        };
    } catch (error) {
        console.error('Admin getAppointments error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

module.exports = {
    getStats,
    getUsers,
    updateUserRole,
    deleteUser,
    getAppointments
};

