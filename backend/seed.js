const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');
const Trip = require('./models/Trip');
const Expense = require('./models/Expense');

dotenv.config();

const users = [
    { name: 'John Manager', email: 'manager@fleet.com', password: 'password123', role: 'Fleet Manager' },
    { name: 'Alice Dispatcher', email: 'dispatcher@fleet.com', password: 'password123', role: 'Dispatcher' },
    { name: 'Bob Safety', email: 'safety@fleet.com', password: 'password123', role: 'Safety Officer' },
    { name: 'Finance Pro', email: 'finance@fleet.com', password: 'password123', role: 'Financial Analyst' },
];

const vehicles = [
    { licensePlate: 'FLEET-001', model: 'Ford F-150', type: 'Truck', maxLoadCapacity: 1500, region: 'East', status: 'Available' },
    { licensePlate: 'FLEET-002', model: 'Mercedes Sprinter', type: 'Van', maxLoadCapacity: 2500, region: 'West', status: 'On Trip' },
    { licensePlate: 'FLEET-003', model: 'Volvo FH16', type: 'Trailer', maxLoadCapacity: 40000, region: 'Midwest', status: 'In Shop' },
    { licensePlate: 'FLEET-004', model: 'Ram 2500', type: 'Truck', maxLoadCapacity: 2000, region: 'South', status: 'Available' },
    { licensePlate: 'FLEET-005', model: 'Tesla Semi', type: 'Trailer', maxLoadCapacity: 35000, region: 'West', status: 'Available' },
    { licensePlate: 'FLEET-006', model: 'Isuzu NPR', type: 'Truck', maxLoadCapacity: 5000, region: 'North', status: 'On Trip' },
    { licensePlate: 'FLEET-007', model: 'Ford Transit', type: 'Van', maxLoadCapacity: 1800, region: 'East', status: 'Available' },
    { licensePlate: 'FLEET-008', model: 'Scania R500', type: 'Trailer', maxLoadCapacity: 42000, region: 'South', status: 'Available' },
    { licensePlate: 'FLEET-009', model: 'Chevrolet Silverado', type: 'Truck', maxLoadCapacity: 2200, region: 'Midwest', status: 'Available' },
    { licensePlate: 'FLEET-010', model: 'Freightliner Cascadia', type: 'Trailer', maxLoadCapacity: 38000, region: 'North', status: 'Available' },
];

const drivers = [
    { name: 'Mike Ross', licenseNumber: 'D-101', licenseExpiryDate: '2027-12-31', phone: '555-0101', status: 'Off Duty', safetyScore: 98 },
    { name: 'Sarah Jane', licenseNumber: 'D-102', licenseExpiryDate: '2026-06-30', phone: '555-0102', status: 'On Duty', safetyScore: 95 },
    { name: 'Tom Hardy', licenseNumber: 'D-103', licenseExpiryDate: '2023-01-01', phone: '555-0103', status: 'Suspended', safetyScore: 75 },
    { name: 'Elena Gilbert', licenseNumber: 'D-104', licenseExpiryDate: '2028-10-15', phone: '555-0104', status: 'Off Duty', safetyScore: 92 },
    { name: 'Damon Salvatore', licenseNumber: 'D-105', licenseExpiryDate: '2025-05-20', phone: '555-0105', status: 'On Duty', safetyScore: 88 },
    { name: 'Bonnie Bennett', licenseNumber: 'D-106', licenseExpiryDate: '2029-01-01', phone: '555-0106', status: 'Off Duty', safetyScore: 96 },
    { name: 'Alaric Saltzman', licenseNumber: 'D-107', licenseExpiryDate: '2026-11-12', phone: '555-0107', status: 'Off Duty', safetyScore: 90 },
    { name: 'Caroline Forbes', licenseNumber: 'D-108', licenseExpiryDate: '2027-03-24', phone: '555-0108', status: 'Off Duty', safetyScore: 94 },
    { name: 'Stefan Salvatore', licenseNumber: 'D-109', licenseExpiryDate: '2028-09-09', phone: '555-0109', status: 'Off Duty', safetyScore: 97 },
    { name: 'Matt Donovan', licenseNumber: 'D-110', licenseExpiryDate: '2025-12-25', phone: '555-0110', status: 'Off Duty', safetyScore: 89 },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fleet-mgmt');
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Vehicle.deleteMany({});
        await Driver.deleteMany({});
        await Trip.deleteMany({});
        await Expense.deleteMany({});

        console.log('Seeding users...');
        for (let u of users) {
            const user = new User(u);
            await user.save();
        }

        console.log('Seeding vehicles...');
        const seededVehicles = await Vehicle.insertMany(vehicles);

        console.log('Seeding drivers...');
        const seededDrivers = await Driver.insertMany(drivers);

        console.log('Seeding sample expenses...');
        const sampleExpenses = [];
        for (let i = 0; i < 20; i++) {
            sampleExpenses.push({
                vehicle: seededVehicles[i % seededVehicles.length]._id,
                type: i % 2 === 0 ? 'Fuel' : 'Maintenance',
                amount: Math.floor(Math.random() * 500) + 50,
                date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
                description: i % 2 === 0 ? 'Monthly Fuel Refill' : 'Routine Checkup',
                odometerReading: 12000 + (i * 500)
            });
        }
        await Expense.insertMany(sampleExpenses);

        console.log('Database Seeded with Expanded Data Successfully!');
        process.exit();
    } catch (err) {
        console.error('SEED ERROR:', err);
        process.exit(1);
    }
};

seedDB();
