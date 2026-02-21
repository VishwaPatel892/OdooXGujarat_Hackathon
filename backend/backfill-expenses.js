// One-time script to backfill existing expense records with details data
require('dotenv').config();
const mongoose = require('mongoose');
const Expense = require('./models/Expense');

const fuelDescriptions = [
    'Regular diesel refuel at highway station',
    'Full tank top-up before long haul',
    'City route refueling stop',
    'Overnight depot fuel fill',
    'Emergency fuel top-up on route',
    'Weekly scheduled refuel',
    'Premium diesel fill for highway run',
    'Quick refuel at depot pump'
];

const maintDescriptions = [
    'Scheduled brake pad replacement',
    'Quarterly oil and filter change',
    'AC compressor repair and regas',
    'Tire rotation and alignment',
    'Engine diagnostic and tune-up',
    'Battery replacement and electrical check',
    'Transmission fluid flush',
    'General safety inspection'
];

const serviceTypes = [
    'Oil Change', 'Brake Service', 'Tire Rotation', 'Engine Repair',
    'Transmission', 'Battery', 'AC Service', 'General Inspection'
];

async function backfill() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const expenses = await Expense.find({});
    console.log(`Found ${expenses.length} expenses to update`);

    let updated = 0;
    for (const ex of expenses) {
        const updates = {};

        if (ex.type === 'Fuel') {
            if (!ex.details?.liters) {
                updates['details.liters'] = Math.round(30 + Math.random() * 70); // 30-100 liters
            }
            if (!ex.details?.description) {
                updates['details.description'] = fuelDescriptions[Math.floor(Math.random() * fuelDescriptions.length)];
            }
        } else if (ex.type === 'Maintenance') {
            if (!ex.details?.serviceType) {
                updates['details.serviceType'] = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
            }
            if (!ex.details?.description) {
                updates['details.description'] = maintDescriptions[Math.floor(Math.random() * maintDescriptions.length)];
            }
        }

        if (Object.keys(updates).length > 0) {
            await Expense.findByIdAndUpdate(ex._id, { $set: updates });
            updated++;
            console.log(`Updated ${ex._id} (${ex.type}):`, updates);
        }
    }

    console.log(`\nDone! Updated ${updated} records.`);
    process.exit(0);
}

backfill().catch(err => { console.error(err); process.exit(1); });
