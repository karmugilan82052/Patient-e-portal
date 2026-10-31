# 🏥 Patient e-Portal - Medical Consultation Platform

A modern, full-stack Serverless Medical Consultation & Telehealth Portal where patients can raise consultation requests, doctors can review patient clinical vitals and schedule appointments, and administrators can oversee the entire platform across multiple regional councils.

---

## 🌟 Key Features

### 1. 🌿 Medical Emerald & Mint Theme
- Polished, responsive healthcare design system with custom status pills, clean typography, and interactive components.

### 2. 👥 Role-Based Access Control (RBAC)
- **Patient (`USER`):** Request consultations, complete mock UPI payments with QR codes, view history, print/download official medical consultation slips and invoices.
- **Doctor (`DOCTOR`):** View open enquiries filtered by council, review patient health vitals (Blood group, allergies, age, gender, emergency contact), and schedule consultations.
- **Administrator (`ADMIN`):** Real-time analytics dashboard, council distribution breakdowns, user directory management (promote/demote roles, delete accounts), and cross-council consultation records.

### 3. 🩺 Extended Patient Health Profile
- Patients can record and manage critical vitals: Blood Group (`A+`, `B+`, `O+`, etc.), Known Allergies, Age, Gender, and Emergency Contacts.
- Doctors review these vitals directly on enquiry cards prior to scheduling.

### 4. 🔔 In-App Notifications & Alerts
- Real-time notification bell with unread counters:
  - Doctors are alerted when new patient enquiries arrive.
  - Patients are alerted when consultations are scheduled or confirmed.

### 5. 🔍 Real-Time Search, Filtering & Sorting
- Instant filtering by symptom, patient name, doctor, issue description, or status (`All`, `Pending`, `Confirmed`) with date sorting.

### 6. 📄 Consultation Slip & Invoice Download (Printable PDF)
- 1-click printable medical summary and payment receipt modal with computer-generated invoice number, fee breakdown, and verification stamp.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/karmugilan82052/Patient-e-portal.git
cd Patient-e-portal
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Start Development Server
```bash
npm run dev
```
* **Frontend:** `http://localhost:5173/`
* **Backend API:** `http://localhost:3000/dev`

---

## 🔑 Test Accounts (Password for all: `password123`)

| Role | Name | Email | Council |
| :--- | :--- | :--- | :--- |
| **Admin** | Super Admin | `admin@example.com` | `HQ-Admin` |
| **Doctor** | Dr. Kamal | `doctor@example.com` | `5-Roads` |
| **Doctor** | Dr. Priya Raman | `priya.raman@example.com` | `Junction` |
| **Doctor** | Dr. Rajesh Varma | `rajesh.varma@example.com` | `Omalur` |
| **Doctor** | Dr. Ananya Iyer | `ananya.iyer@example.com` | `Hastampatti` |
| **Doctor** | Dr. Suresh Kumar | `suresh.kumar@example.com` | `4-Roads` |
| **Patient** | Maria | `patient@example.com` | `5-Roads` |
| **Patient** | Hariharan | `hariharan@example.com` | `5-Roads` |
| **Patient** | Arun Prasad | `arun.prasad@example.com` | `Junction` |
| **Patient** | Sneha Reddy | `sneha.reddy@example.com` | `Omalur` |
| **Patient** | Vikram Sengupta | `vikram.sengupta@example.com` | `Hastampatti` |
| **Patient** | Kavitha Krishnan | `kavitha.krishnan@example.com` | `4-Roads` |
| **Patient** | Divya Ramesh | `divya.ramesh@example.com` | `5-Roads` |

---

## 🏗️ Architecture & Tech Stack

- **Frontend:** React 19, Vite, React Router DOM, Axios, Custom Medical CSS Theme
- **Backend:** Node.js, Express / AWS Lambda Handler, Serverless Framework
- **Database:** DynamoDB / Emulated Local JSON Persistence (`.local-db.json`)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **Notifications:** AWS SES (Simple Email Service) / In-App Notification Center
