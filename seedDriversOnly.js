const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Driver = require('./models/Driver');

dotenv.config();

const drivers = [
    {
        name: 'James Rodriguez',
        phone: '+1-555-0101',
        licenseNumber: 'CDL-90210',
        licenseExpiryDate: '2026-08-15',
        status: 'On Duty',
        tripCompletionRate: 96,
        safetyScore: 92
    },
    {
        name: 'Sarah Chen',
        phone: '+1-555-0102',
        licenseNumber: 'CDL-90211',
        licenseExpiryDate: '2025-03-20',
        status: 'Off Duty',
        tripCompletionRate: 98,
        safetyScore: 97
    },
    {
        name: 'Michael Torres',
        phone: '+1-555-0103',
        licenseNumber: 'CDL-90212',
        licenseExpiryDate: '2026-11-30',
        status: 'On Duty',
        tripCompletionRate: 89,
        safetyScore: 85
    },
    {
        name: 'Emily Watson',
        phone: '+1-555-0104',
        licenseNumber: 'CDL-90213',
        licenseExpiryDate: '2024-12-01',
        status: 'Off Duty',
        tripCompletionRate: 94,
        safetyScore: 90
    },
    {
        name: 'David Kim',
        phone: '+1-555-0105',
        licenseNumber: 'CDL-90214',
        licenseExpiryDate: '2027-06-10',
        status: 'Off Duty',
        tripCompletionRate: 91,
        safetyScore: 88
    },
    {
        name: 'Lisa Patel',
        phone: '+1-555-0106',
        licenseNumber: 'CDL-90215',
        licenseExpiryDate: '2026-01-25',
        status: 'Suspended',
        tripCompletionRate: 72,
        safetyScore: 65
    },
    {
        name: 'Eva Patel',
        phone: '+1-234-0123',
        licenseNumber: 'DBJ-56034',
        licenseExpiryDate: '2027-01-01',
        status: 'On Duty',
        tripCompletionRate: 90,
        safetyScore: 76
    }
];

const seedDrivers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fleet-mgmt');
        console.log('Connected to MongoDB');

        console.log('Clearing existing drivers...');
        await Driver.deleteMany({});

        console.log('Seeding screenshot driver data...');
        await Driver.insertMany(drivers);

        console.log('✅ 7 drivers seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('SEED ERROR:', err);
        process.exit(1);
    }
};

seedDrivers();
