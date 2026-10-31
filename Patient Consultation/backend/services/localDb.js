const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', '.local-db.json');

const INITIAL_DATA = {
    users: [
        {
            userId: 'user-admin-1',
            name: 'Super Admin',
            email: 'admin@example.com',
            passwordHash: '$2b$10$4EcoeyuvD6de5Tth5Zs6EO.IhzcxTr4M098JAEToLEBreol.twRZW', // password123
            role: 'ADMIN',
            councilId: 'HQ-Admin',
            createdAt: '2026-10-31T10:00:00.000Z'
        },
        {
            userId: 'user-doctor-1',
            name: 'Dr. Kamal',
            email: 'doctor@example.com',
            passwordHash: '$2b$10$4EcoeyuvD6de5Tth5Zs6EO.IhzcxTr4M098JAEToLEBreol.twRZW',
            role: 'DOCTOR',
            councilId: '5-Roads',
            createdAt: '2026-10-26T09:58:53.065Z'
        },
        {
            userId: 'user-doctor-2',
            name: 'Dr. Priya Raman',
            email: 'priya.raman@example.com',
            passwordHash: '$2b$10$4EcoeyuvD6de5Tth5Zs6EO.IhzcxTr4M098JAEToLEBreol.twRZW',
            role: 'DOCTOR',
            councilId: 'Junction',
            createdAt: '2026-10-27T10:00:00.000Z'
        },
        {
            userId: 'user-doctor-3',
            name: 'Dr. Rajesh Varma',
            email: 'rajesh.varma@example.com',
            passwordHash: '$2b$10$4EcoeyuvD6de5Tth5Zs6EO.IhzcxTr4M098JAEToLEBreol.twRZW',
            role: 'DOCTOR',
            councilId: 'Omalur',
            createdAt: '2026-10-28T11:00:00.000Z'
        },
        {
            userId: 'user-doctor-4',
            name: 'Dr. Ananya Iyer',
            email: 'ananya.iyer@example.com',
            passwordHash: '$2b$10$4EcoeyuvD6de5Tth5Zs6EO.IhzcxTr4M098JAEToLEBreol.twRZW',
            role: 'DOCTOR',
            councilId: 'Hastampatti',
            createdAt: '2026-10-29T09:30:00.000Z'
        },
        {
            userId: 'user-doctor-5',
            name: 'Dr. Suresh Kumar',
            email: 'suresh.kumar@example.com',
            passwordHash: '$2b$10$4EcoeyuvD6de5Tth5Zs6EO.IhzcxTr4M098JAEToLEBreol.twRZW',
            role: 'DOCTOR',
            councilId: '4-Roads',
            createdAt: '2026-10-30T08:45:00.000Z'
        },
        {
            userId: 'user-patient-1',
            name: 'Maria',
            email: 'patient@example.com',
            passwordHash: '$2b$10$4EcoeyuvD6de5Tth5Zs6EO.IhzcxTr4M098JAEToLEBreol.twRZW',
            role: 'USER',
            councilId: '5-Roads',
            bloodGroup: 'B+',
            allergies: 'Aspirin',
            age: '29',
            gender: 'Female',
            emergencyContact: '+91 98765 12345',
            createdAt: '2026-10-26T09:58:53.065Z'
        },
        {
            userId: 'user-patient-2',
            name: 'Hariharan',
            email: 'hariharan@example.com',
            passwordHash: '$2b$10$4EcoeyuvD6de5Tth5Zs6EO.IhzcxTr4M098JAEToLEBreol.twRZW',
            role: 'USER',
            councilId: '5-Roads',
            bloodGroup: 'O+',
            allergies: 'Penicillin',
            age: '24',
            gender: 'Male',
            emergencyContact: '+91 98765 43210',
            createdAt: '2026-10-26T09:58:53.065Z'
        },
        {
            userId: 'user-d5a8fa0e-7ca6-44fe-93eb-4b8b9697d79d',
            name: 'Karmugilan',
            email: 'lavanyamatheswaran07@gmail.com',
            passwordHash: '$2b$10$dXGGy006ioZNjZCNZVxra.MetRREA1QVqSWkJXN0fZruImMZz4GsG',
            role: 'USER',
            councilId: '5-Roads',
            bloodGroup: 'O+',
            allergies: 'None',
            age: '23',
            gender: 'Male',
            emergencyContact: '+91 94433 11223',
            createdAt: '2026-10-26T10:15:52.738Z'
        },
        {
            userId: 'user-patient-3',
            name: 'Arun Prasad',
            email: 'arun.prasad@example.com',
            passwordHash: '$2b$10$4EcoeyuvD6de5Tth5Zs6EO.IhzcxTr4M098JAEToLEBreol.twRZW',
            role: 'USER',
            councilId: 'Junction',
            bloodGroup: 'A+',
            allergies: 'Dust & Pollen',
            age: '34',
            gender: 'Male',
            emergencyContact: '+91 98401 23456',
            createdAt: '2026-10-28T14:20:00.000Z'
        },
        {
            userId: 'user-patient-4',
            name: 'Sneha Reddy',
            email: 'sneha.reddy@example.com',
            passwordHash: '$2b$10$4EcoeyuvD6de5Tth5Zs6EO.IhzcxTr4M098JAEToLEBreol.twRZW',
            role: 'USER',
            councilId: 'Omalur',
            bloodGroup: 'B-',
            allergies: 'None',
            age: '27',
            gender: 'Female',
            emergencyContact: '+91 97890 87654',
            createdAt: '2026-10-29T11:15:00.000Z'
        },
        {
            userId: 'user-patient-5',
            name: 'Vikram Sengupta',
            email: 'vikram.sengupta@example.com',
            passwordHash: '$2b$10$4EcoeyuvD6de5Tth5Zs6EO.IhzcxTr4M098JAEToLEBreol.twRZW',
            role: 'USER',
            councilId: 'Hastampatti',
            bloodGroup: 'AB+',
            allergies: 'Sulfa drugs',
            age: '42',
            gender: 'Male',
            emergencyContact: '+91 99620 54321',
            createdAt: '2026-10-30T16:00:00.000Z'
        },
        {
            userId: 'user-patient-6',
            name: 'Kavitha Krishnan',
            email: 'kavitha.krishnan@example.com',
            passwordHash: '$2b$10$4EcoeyuvD6de5Tth5Zs6EO.IhzcxTr4M098JAEToLEBreol.twRZW',
            role: 'USER',
            councilId: '4-Roads',
            bloodGroup: 'O-',
            allergies: 'Ibuprofen',
            age: '31',
            gender: 'Female',
            emergencyContact: '+91 94440 98765',
            createdAt: '2026-10-30T17:30:00.000Z'
        },
        {
            userId: 'user-patient-7',
            name: 'Divya Ramesh',
            email: 'divya.ramesh@example.com',
            passwordHash: '$2b$10$4EcoeyuvD6de5Tth5Zs6EO.IhzcxTr4M098JAEToLEBreol.twRZW',
            role: 'USER',
            councilId: '5-Roads',
            bloodGroup: 'O+',
            allergies: 'None',
            age: '22',
            gender: 'Female',
            emergencyContact: '+91 98840 11223',
            createdAt: '2026-10-31T08:00:00.000Z'
        }
    ],
    appointments: [
        {
            appointmentId: 'app-seed-hariharan-1',
            userId: 'user-patient-2',
            councilId: '5-Roads',
            symptoms: 'High fever, body chills',
            medications: 'Paracetamol 500mg',
            issueDescription: 'Fever for 3 days with headache',
            preferredDate: '2026-11-04',
            status: 'PENDING',
            feeAmount: 200,
            paymentStatus: 'PAID',
            createdAt: '2026-10-26T09:58:53.065Z',
            updatedAt: '2026-10-26T09:58:53.065Z'
        },
        {
            appointmentId: 'app-seed-maria-1',
            userId: 'user-patient-1',
            doctorId: 'user-doctor-1',
            councilId: '5-Roads',
            symptoms: 'Migraine episodes, photophobia',
            medications: 'None',
            issueDescription: 'Severe throbbing unilateral headache',
            preferredDate: '2026-11-03',
            appointmentDateTime: '2026-11-03T10:30:00.000Z',
            status: 'CONFIRMED',
            feeAmount: 200,
            paymentStatus: 'PAID',
            createdAt: '2026-10-27T08:30:00.000Z',
            updatedAt: '2026-10-27T09:00:00.000Z'
        },
        {
            appointmentId: 'app-seed-arun-1',
            userId: 'user-patient-3',
            councilId: 'Junction',
            symptoms: 'Chest tightness, shortness of breath on exertion',
            medications: 'Aspirin 75mg',
            issueDescription: 'Mild cardiovascular discomfort when climbing stairs',
            preferredDate: '2026-11-05',
            status: 'PENDING',
            feeAmount: 200,
            paymentStatus: 'PAID',
            createdAt: '2026-10-28T14:30:00.000Z',
            updatedAt: '2026-10-28T14:30:00.000Z'
        },
        {
            appointmentId: 'app-seed-sneha-1',
            userId: 'user-patient-4',
            doctorId: 'user-doctor-3',
            councilId: 'Omalur',
            symptoms: 'Skin rashes and itchy eczema on hands',
            medications: 'Cetirizine 10mg',
            issueDescription: 'Contact dermatitis flare-up with red patches',
            preferredDate: '2026-11-02',
            appointmentDateTime: '2026-11-02T15:00:00.000Z',
            status: 'CONFIRMED',
            feeAmount: 200,
            paymentStatus: 'PAID',
            createdAt: '2026-10-29T11:30:00.000Z',
            updatedAt: '2026-10-29T12:00:00.000Z'
        },
        {
            appointmentId: 'app-seed-vikram-1',
            userId: 'user-patient-5',
            councilId: 'Hastampatti',
            symptoms: 'Acute pain in right knee joint, swelling',
            medications: 'None',
            issueDescription: 'Knee twisted while jogging; unable to bear full weight',
            preferredDate: '2026-11-06',
            status: 'PENDING',
            feeAmount: 200,
            paymentStatus: 'PAID',
            createdAt: '2026-10-30T16:15:00.000Z',
            updatedAt: '2026-10-30T16:15:00.000Z'
        },
        {
            appointmentId: 'app-seed-kavitha-1',
            userId: 'user-patient-6',
            doctorId: 'user-doctor-5',
            councilId: '4-Roads',
            symptoms: 'Chronic lower back stiffness and sciatica',
            medications: 'Muscle relaxants',
            issueDescription: 'Postural lumbar disc strain radiating to left leg',
            preferredDate: '2026-11-04',
            appointmentDateTime: '2026-11-04T11:00:00.000Z',
            status: 'CONFIRMED',
            feeAmount: 200,
            paymentStatus: 'PAID',
            createdAt: '2026-10-30T17:45:00.000Z',
            updatedAt: '2026-10-30T18:15:00.000Z'
        },
        {
            appointmentId: 'app-seed-divya-1',
            userId: 'user-patient-7',
            councilId: '5-Roads',
            symptoms: 'Sore throat, dry cough, mild fatigue',
            medications: 'Vitamin C, Lozenges',
            issueDescription: 'Seasonal viral pharyngitis with throat irritation',
            preferredDate: '2026-11-07',
            status: 'PENDING',
            feeAmount: 200,
            paymentStatus: 'PAID',
            createdAt: '2026-10-31T08:15:00.000Z',
            updatedAt: '2026-10-31T08:15:00.000Z'
        }
    ]
};

function readDb() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
            return INITIAL_DATA;
        }
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('[LOCAL_DB] Read error:', err);
        return INITIAL_DATA;
    }
}

function writeDb(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('[LOCAL_DB] Write error:', err);
    }
}

const localDb = {
    async createUser(user) {
        const db = readDb();
        db.users.push(user);
        writeDb(db);
        return {};
    },

    async getUserByEmail(email) {
        const db = readDb();
        return db.users.find(u => u.email && u.email.toLowerCase() === (email || '').toLowerCase());
    },

    async getUserById(userId) {
        const db = readDb();
        return db.users.find(u => u.userId === userId);
    },

    async getAllUsers() {
        const db = readDb();
        return db.users || [];
    },

    async deleteUser(userId) {
        const db = readDb();
        db.users = (db.users || []).filter(u => u.userId !== userId);
        writeDb(db);
        return { message: 'User deleted successfully' };
    },

    async updateUser(userId, updates) {
        const db = readDb();
        const user = db.users.find(u => u.userId === userId);
        if (user) {
            Object.assign(user, updates);
            user.updatedAt = new Date().toISOString();
            writeDb(db);
        }
        return user;
    },

    async createAppointment(appointment) {
        const db = readDb();
        db.appointments.push(appointment);
        writeDb(db);
        return {};
    },

    async getAppointmentsByUser(userId) {
        const db = readDb();
        return db.appointments.filter(a => a.userId === userId);
    },

    async getAppointmentsByCouncil(councilId) {
        const db = readDb();
        return db.appointments.filter(a => a.councilId === councilId);
    },

    async getAllAppointments() {
        const db = readDb();
        return db.appointments || [];
    },

    async getAppointmentById(appointmentId) {
        const db = readDb();
        return db.appointments.find(a => a.appointmentId === appointmentId);
    },

    async updateAppointmentStatus(appointmentId, status, appointmentDateTime, doctorId) {
        const db = readDb();
        const app = db.appointments.find(a => a.appointmentId === appointmentId);
        if (app) {
            app.status = status;
            app.updatedAt = new Date().toISOString();
            if (appointmentDateTime) app.appointmentDateTime = appointmentDateTime;
            if (doctorId) app.doctorId = doctorId;
            writeDb(db);
        }
        return app;
    }
};

module.exports = localDb;
