const dynamoService = require('../services/dynamoService');
const emailService = require('../services/emailService');
const { generateAppointmentId } = require('../utils/generateId');

const createAppointment = async (event) => {
    try {
        let { symptoms, medications, preferredDate, issueDescription } = JSON.parse(event.body);
        const { userId, councilId } = event.user;

        const appointmentId = generateAppointmentId();
        const newAppointment = {
            appointmentId,
            userId,
            councilId,
            symptoms,
            medications,
            issueDescription,
            preferredDate,
            status: 'PENDING',
            feeAmount: 200,
            paymentStatus: 'PAID',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        console.log('[DEBUG] Saving Appointment:', JSON.stringify(newAppointment, null, 2));
        await dynamoService.createAppointment(newAppointment);

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Appointment request created',
                status: 'PENDING',
                appointmentId
            })
        };
    } catch (error) {
        console.error('Create Appointment Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

const getDoctorAppointments = async (event) => {
    try {
        const { councilId, role } = event.user;

        if (role !== 'DOCTOR') {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Forbidden: Only doctors can view these appointments' })
            };
        }

        console.log('[DEBUG] Fetching appointments for council:', councilId);
        const appointments = await dynamoService.getAppointmentsByCouncil(councilId);

        // Fetch patient details and health vitals for each appointment
        const enrichedAppointments = await Promise.all(appointments.map(async (app) => {
            const patient = await dynamoService.getUserById(app.userId);
            return {
                ...app,
                patientName: patient ? patient.name : 'Unknown',
                patientEmail: patient ? patient.email : '',
                bloodGroup: patient ? patient.bloodGroup || 'Not specified' : 'Not specified',
                allergies: patient ? patient.allergies || 'None' : 'None',
                age: patient ? patient.age || '' : '',
                gender: patient ? patient.gender || '' : '',
                emergencyContact: patient ? patient.emergencyContact || '' : ''
            };
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(enrichedAppointments)
        };
    } catch (error) {
        console.error('Get Doctor Appointments Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

const updateAppointmentStatus = async (event) => {
    try {
        const { id } = event.pathParameters;
        const { status, appointmentDateTime } = JSON.parse(event.body);
        const { userId, role } = event.user;

        if (role !== 'DOCTOR') {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Forbidden' })
            };
        }

        const appointment = await dynamoService.getAppointmentById(id);
        if (!appointment) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Appointment not found' })
            };
        }

        await dynamoService.updateAppointmentStatus(id, status, appointmentDateTime, userId);

        if (status === 'CONFIRMED') {
            const patient = await dynamoService.getUserById(appointment.userId);
            if (patient && patient.email) {
                try {
                    await emailService.sendConfirmationEmail(patient.email, patient.name);
                } catch (emailError) {
                    console.error('Failed to send confirmation email:', emailError);
                }
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Appointment updated' })
        };
    } catch (error) {
        console.error('Update Appointment Status Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

const getPatientAppointments = async (event) => {
    try {
        const { userId } = event.user;

        console.log('[DEBUG] Fetching history for patient:', userId);
        const appointments = await dynamoService.getAppointmentsByUser(userId);

        const enrichedAppointments = await Promise.all(appointments.map(async (app) => {
            let doctorName = null;
            if (app.doctorId) {
                const doc = await dynamoService.getUserById(app.doctorId);
                if (doc) doctorName = doc.name;
            }
            return {
                ...app,
                doctorName: doctorName || 'Assigned Consultant'
            };
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(enrichedAppointments)
        };
    } catch (error) {
        console.error('Get Patient Appointments Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

module.exports = {
    createAppointment,
    getDoctorAppointments,
    getPatientAppointments,
    updateAppointmentStatus
};
