# 🏥 Serverless Medical Consultation Portal

A cloud-based medical consultation portal where:

- Users (patients) can raise consultation requests
- Doctors can confirm or postpone appointments
- Email notifications are automatically triggered on confirmation
- Hosted fully on AWS using Serverless Architecture

---

# 🚀 Tech Stack

## Frontend
- React.js
- Axios
- React Router

## Backend
- Node.js
- AWS Lambda
- API Gateway

## Database
- Amazon DynamoDB

## Notifications
- Amazon SES (Simple Email Service)

## Hosting
- Amazon S3 (Static Hosting)
- CloudFront (Optional CDN)

---

# 🏗 Architecture Overview



React (S3 Hosted)
|
v
CloudFront (Optional)
|
v
API Gateway
|
v
AWS Lambda (Node.js)
|
v
DynamoDB
|
v
SES (Email Service)


---

# 👥 User Roles

1. USER (Patient)
2. DOCTOR
3. ADMIN (Platform Administrator)

---

# 📦 Database Design

## Users Table

| Field | Type |
|-------|------|
| userId (PK) | String |
| name | String |
| email | String |
| passwordHash | String |
| role | USER / DOCTOR |
| councilId | String (Optional for doctors) |

---

## Appointments Table

| Field | Type |
|-------|------|
| appointmentId (PK) | String |
| userId | String |
| doctorId | String |
| appointmentDateTime | String (ISO) |
| status | PENDING / CONFIRMED / POSTPONED |
| reason | String |
| createdAt | String |
| updatedAt | String |

---

# 🔌 API Design

Base URL:


https://your-api-id.execute-api.region.amazonaws.com


---

## 1️⃣ Register

POST `/auth/register`

Request:
```json
{
  "name": "John",
  "email": "john@email.com",
  "password": "123456",
  "role": "USER"
}


Response:

{
  "message": "User registered successfully"
}

2️⃣ Login

POST /auth/login

Request:

{
  "email": "john@email.com",
  "password": "123456"
}


Response:

{
  "token": "JWT_TOKEN",
  "role": "USER"
}

3️⃣ Create Appointment

POST /appointments

Headers:

Authorization: Bearer <JWT_TOKEN>


Request:

{
  "doctorId": "doc-123",
  "appointmentDateTime": "2026-03-01T10:00:00Z",
  "reason": "General Consultation"
}


Response:

{
  "message": "Appointment created",
  "status": "PENDING"
}

4️⃣ Doctor View Appointments

GET /appointments/doctor

Response:

[
  {
    "appointmentId": "app-123",
    "patientName": "John",
    "status": "PENDING",
    "appointmentDateTime": "2026-03-01T10:00:00Z"
  }
]

5️⃣ Update Appointment Status

PUT /appointments/{id}

Request:

{
  "status": "CONFIRMED"
}


If status = CONFIRMED:
→ Trigger SES email notification to patient

Response:

{
  "message": "Appointment updated"
}

📁 Project Structure
Backend
backend/
│
├── handler.js
├── routes/
│   ├── auth.js
│   └── appointments.js
│
├── services/
│   ├── dynamoService.js
│   └── emailService.js
│
├── middleware/
│   └── authMiddleware.js
│
├── utils/
│   └── generateId.js
│
├── package.json
└── serverless.yml

Frontend
frontend/
│
├── src/
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── CreateAppointment.js
│   │   ├── DoctorDashboard.js
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── components/
│   │   └── Navbar.js
│   │
│   └── App.js
│
└── package.json

🔐 Authentication

JWT-based authentication

Password hashing using bcrypt

Protected routes via middleware

Store JWT secret in environment variables

📧 Email Workflow (SES)

When doctor updates appointment to CONFIRMED:

Update DynamoDB

Trigger SES sendEmail()

Patient receives confirmation email

Email Template:

Subject:

Appointment Confirmed


Body:

Dear <Patient Name>,

Your appointment has been confirmed.

Thank you.

☁️ AWS Deployment Steps
1️⃣ Create DynamoDB Tables

Users

Appointments

2️⃣ Create IAM Role

Permissions:

DynamoDB access

SES send email

3️⃣ Create Lambda Function

Runtime: Node.js 18+

Upload backend zip

Attach IAM role

4️⃣ Setup API Gateway

Create HTTP API

Add routes

Enable CORS

Deploy

5️⃣ Configure SES

Verify sender email

Move out of sandbox (optional)

6️⃣ Deploy React App
npm run build


Upload /build folder to S3 bucket
Enable static website hosting
(Optional) Attach CloudFront

🛡 Security Best Practices

Use IAM Roles (no hardcoded AWS keys)

Store secrets in environment variables

Validate all input data

Enable HTTPS

Hash passwords before storing

Never expose DynamoDB publicly

🎯 Project Outcome

This project demonstrates:

Serverless architecture

REST API design

Authentication & authorization

Cloud deployment

Automated email workflows

Scalable AWS-native system