const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Vehicle = require('./models/Vehicle');
const Maintenance = require('./models/Maintenance');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fleet-mgmt';

const seed = async () => {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const vehicles = await Vehicle.find().limit(5);
    if (vehicles.length === 0) {
        console.log('No vehicles found. Please seed vehicles first.');
        process.exit(1);
    }

    // Clear existing
    await Maintenance.deleteMany({});

    const records = [
        { vehicle: vehicles[0]._id, serviceType: 'Engine Repair', description: 'Replaced engine gaskets and timing belt', date: new Date('2026-02-19'), cost: 2400 },
        { vehicle: vehicles[1]?._id || vehicles[0]._id, serviceType: 'Oil Change', description: 'Full synthetic oil change and filter replacement', date: new Date('2026-02-10'), cost: 180 },
        { vehicle: vehicles[2]?._id || vehicles[0]._id, serviceType: 'Brake Service', description: 'Front brake pads and rotor replacement', date: new Date('2026-02-05'), cost: 650 },
        { vehicle: vehicles[3]?._id || vehicles[0]._id, serviceType: 'Tire Rotation', description: 'Tire rotation and alignment check', date: new Date('2026-01-28'), cost: 120 },
        { vehicle: vehicles[4]?._id || vehicles[0]._id, serviceType: 'Transmission', description: 'Transmission fluid flush and filter change', date: new Date('2026-02-15'), cost: 1800 },
    ];

    await Maintenance.insertMany(records);
    console.log('Seeded 5 maintenance records!');
    process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
