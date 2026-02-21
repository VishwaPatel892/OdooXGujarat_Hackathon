# Fleet Management System (FleetOS)

A high-fidelity full-stack web application for managing vehicle fleets, driver assignments, and trip logistics.

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally at `mongodb://localhost:27017/fleet-mgmt`

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed  # Populate with sample data
npm start     # Runs on port 5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Runs on port 5173
```

## 🔑 Demo Credentials
All users use the password: `password123`

| Role | Email | Permissions |
| --- | --- | --- |
| **Fleet Manager** | `manager@fleet.com` | Full Access |
| **Dispatcher** | `dispatcher@fleet.com` | Create Trips, Status Updates |
| **Safety Officer** | `safety@fleet.com` | Manage Drivers, Scores |
| **Financial Analyst** | `finance@fleet.com` | View Expenses, ROI |

## ✨ Key Features
- **Smart Dispatcher**: Prevents overloading vehicles and assigns only eligible drivers.
- **Role-Based UI**: Sidebar and actions dynamically adapt to the user's role.
- **Status Automation**: Vehicle/Driver statuses auto-sync between "Available", "On Trip", and "In Shop".
- **Maintenance Tracking**: Logging maintenance automatically pulls vehicles out of service.
- **Analytics**: Weekly trip distributions and fuel cost trends.
