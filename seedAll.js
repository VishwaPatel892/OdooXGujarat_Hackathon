const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');
const Trip = require('./models/Trip');
const Expense = require('./models/Expense');
const Maintenance = require('./models/Maintenance');

dotenv.config();

// ── USERS ──────────────────────────────────────────────────────────────
const users = [
    { name: 'John Manager', email: 'manager@fleet.com', password: 'password123', role: 'Fleet Manager' },
    { name: 'Alice Dispatcher', email: 'dispatcher@fleet.com', password: 'password123', role: 'Dispatcher' },
    { name: 'Bob Safety', email: 'safety@fleet.com', password: 'password123', role: 'Safety Officer' },
    { name: 'Finance Pro', email: 'finance@fleet.com', password: 'password123', role: 'Financial Analyst' },
];

// ── VEHICLES (exactly matches the Vehicle Registry screenshot) ─────────
const vehicles = [
    { licensePlate: 'ABC-1234', model: 'Ford F-150', type: 'Truck', maxLoadCapacity: 12000, odometer: 85420, region: 'North', status: 'Available' },
    { licensePlate: 'DEF-5678', model: 'Mercedes Sprinter', type: 'Van', maxLoadCapacity: 3500, odometer: 45200, region: 'South', status: 'On Trip' },
    { licensePlate: 'GHI-9012', model: 'Volvo FH16', type: 'Truck', maxLoadCapacity: 15000, odometer: 120300, region: 'East', status: 'In Shop' },
    { licensePlate: 'JKL-3456', model: 'Hyundai Accent', type: 'Sedan', maxLoadCapacity: 500, odometer: 32100, region: 'West', status: 'Available' },
    { licensePlate: 'MNO-7890', model: 'Toyota Land Cruiser', type: 'SUV', maxLoadCapacity: 2000, odometer: 67800, region: 'North', status: 'On Trip' },
    { licensePlate: 'PQR-2345', model: 'Freightliner Cascadia', type: 'Truck', maxLoadCapacity: 18000, odometer: 95600, region: 'South', status: 'Available' },
    { licensePlate: 'STU-6789', model: 'Ford Transit', type: 'Van', maxLoadCapacity: 4000, odometer: 52300, region: 'East', status: 'Out of Service' },
    { licensePlate: 'VWX-0123', model: 'Honda City', type: 'Sedan', maxLoadCapacity: 450, odometer: 28900, region: 'West', status: 'Available' },
];

// ── DRIVERS (matches the driver cards screenshot) ─────────────────────
const drivers = [
    { name: 'Mike Ross', licenseNumber: 'D-101', licenseExpiryDate: '2027-12-31', phone: '555-0101', status: 'Off Duty', safetyScore: 98, tripCompletionRate: 99 },
    { name: 'Sarah Jane', licenseNumber: 'D-102', licenseExpiryDate: '2026-06-30', phone: '555-0102', status: 'On Duty', safetyScore: 95, tripCompletionRate: 96 },
    { name: 'Tom Hardy', licenseNumber: 'D-103', licenseExpiryDate: '2023-01-01', phone: '555-0103', status: 'Suspended', safetyScore: 75, tripCompletionRate: 70 },
    { name: 'Elena Gilbert', licenseNumber: 'D-104', licenseExpiryDate: '2028-10-15', phone: '555-0104', status: 'Off Duty', safetyScore: 92, tripCompletionRate: 94 },
    { name: 'Damon Salvatore', licenseNumber: 'D-105', licenseExpiryDate: '2025-05-20', phone: '555-0105', status: 'On Duty', safetyScore: 88, tripCompletionRate: 85 },
    { name: 'Bonnie Bennett', licenseNumber: 'D-106', licenseExpiryDate: '2029-01-01', phone: '555-0106', status: 'Off Duty', safetyScore: 96, tripCompletionRate: 98 },
    { name: 'Alaric Saltzman', licenseNumber: 'D-107', licenseExpiryDate: '2026-11-12', phone: '555-0107', status: 'Off Duty', safetyScore: 90, tripCompletionRate: 91 },
    { name: 'Caroline Forbes', licenseNumber: 'D-108', licenseExpiryDate: '2027-03-24', phone: '555-0108', status: 'Off Duty', safetyScore: 94, tripCompletionRate: 95 },
    { name: 'Stefan Salvatore', licenseNumber: 'D-109', licenseExpiryDate: '2028-09-09', phone: '555-0109', status: 'Off Duty', safetyScore: 97, tripCompletionRate: 99 },
    { name: 'Matt Donovan', licenseNumber: 'D-110', licenseExpiryDate: '2025-12-25', phone: '555-0110', status: 'Off Duty', safetyScore: 89, tripCompletionRate: 87 },
];

// ───────────────────────────────────────────────────────────────────────
const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fleet-mgmt');
        console.log('✅ Connected to MongoDB');

        console.log('🗑  Clearing existing data...');
        await User.deleteMany({});
        await Vehicle.deleteMany({});
        await Driver.deleteMany({});
        await Trip.deleteMany({});
        await Expense.deleteMany({});
        await Maintenance.deleteMany({});

        // -- Users
        console.log('👤 Seeding users...');
        for (let u of users) {
            const user = new User(u);
            await user.save();
        }

        // -- Vehicles
        console.log('🚗 Seeding vehicles...');
        const seededVehicles = await Vehicle.insertMany(vehicles);
        const veh = (plate) => seededVehicles.find(v => v.licensePlate === plate);

        // -- Drivers
        console.log('👷 Seeding drivers...');
        const seededDrivers = await Driver.insertMany(drivers);
        const drv = (name) => seededDrivers.find(d => d.name === name);

        // ── TRIPS (matches Dashboard: 2 Dispatched, 1 Draft, 1 Cancelled, 4 Completed) ────
        console.log('🗺  Seeding trips...');
        const trips = [
            // Dispatched (2)
            { tripId: 'TR-9821', vehicle: veh('DEF-5678')._id, driver: drv('Sarah Jane')._id, origin: 'LAX Terminal', destination: 'San Francisco Port', cargoWeight: 2200, status: 'Dispatched', dispatchDate: new Date('2026-02-21') },
            { tripId: 'TR-9820', vehicle: veh('MNO-7890')._id, driver: drv('Damon Salvatore')._id, origin: 'Chicago Hub', destination: 'Detroit Warehouse', cargoWeight: 1500, status: 'Dispatched', dispatchDate: new Date('2026-02-20') },
            // Draft (1)
            { tripId: 'TR-9819', vehicle: veh('PQR-2345')._id, driver: drv('Bonnie Bennett')._id, origin: 'Dallas Hub', destination: 'Houston Port', cargoWeight: 14000, status: 'Draft' },
            // Cancelled (1)
            { tripId: 'TR-9818', vehicle: veh('STU-6789')._id, driver: drv('Tom Hardy')._id, origin: 'Philly Depot', destination: 'Newark Terminal', cargoWeight: 3000, status: 'Cancelled', dispatchDate: new Date('2026-02-18') },
            // Completed (4)
            { tripId: 'TR-9817', vehicle: veh('ABC-1234')._id, driver: drv('Mike Ross')._id, origin: 'Boston Depot', destination: 'New York Terminal', cargoWeight: 8000, status: 'Completed', dispatchDate: new Date('2026-02-15'), completionDate: new Date('2026-02-16') },
            { tripId: 'TR-9816', vehicle: veh('JKL-3456')._id, driver: drv('Elena Gilbert')._id, origin: 'Seattle Depot', destination: 'Portland Yard', cargoWeight: 400, status: 'Completed', dispatchDate: new Date('2026-02-13'), completionDate: new Date('2026-02-14') },
            { tripId: 'TR-9815', vehicle: veh('VWX-0123')._id, driver: drv('Stefan Salvatore')._id, origin: 'Denver Airport', destination: 'Albuquerque Depot', cargoWeight: 350, status: 'Completed', dispatchDate: new Date('2026-02-10'), completionDate: new Date('2026-02-11') },
            { tripId: 'TR-9814', vehicle: veh('GHI-9012')._id, driver: drv('Alaric Saltzman')._id, origin: 'Atlanta Hub', destination: 'Charlotte Depot', cargoWeight: 11000, status: 'Completed', dispatchDate: new Date('2026-02-07'), completionDate: new Date('2026-02-08') },
        ];
        const seededTrips = await Trip.insertMany(trips);
        console.log(`   → Inserted ${seededTrips.length} trips  (2 Dispatched, 1 Draft, 1 Cancelled, 4 Completed)`);

        // ── EXPENSES — FUEL (exactly matches Fuel & Expenses screenshot) ────────────────
        // Total Fuel cost $1,295  |  Total liters 785  |  $/L ~$1.65
        console.log('💰 Seeding expenses (fuel)...');
        const fuelExpenses = [
            { vehicle: veh('ABC-1234')._id, type: 'Fuel', amount: 198, date: new Date('2026-02-20'), details: { liters: 120, description: 'Weekly refuel – North region' } },
            { vehicle: veh('DEF-5678')._id, type: 'Fuel', amount: 107, date: new Date('2026-02-19'), details: { liters: 65, description: 'South region diesel top-up' } },
            { vehicle: veh('GHI-9012')._id, type: 'Fuel', amount: 231, date: new Date('2026-02-18'), details: { liters: 140, description: 'East depot fuel fill' } },
            { vehicle: veh('MNO-7890')._id, type: 'Fuel', amount: 132, date: new Date('2026-02-17'), details: { liters: 80, description: 'SUV monthly top-up' } },
            { vehicle: veh('PQR-2345')._id, type: 'Fuel', amount: 264, date: new Date('2026-02-16'), details: { liters: 160, description: 'Freightliner long-haul fuel' } },
            { vehicle: veh('ABC-1234')._id, type: 'Fuel', amount: 190, date: new Date('2026-02-12'), details: { liters: 115, description: 'North branch fuel fill #2' } },
            { vehicle: veh('JKL-3456')._id, type: 'Fuel', amount: 74, date: new Date('2026-02-14'), details: { liters: 45, description: 'Sedan West region refuel' } },
            { vehicle: veh('DEF-5678')._id, type: 'Fuel', amount: 99, date: new Date('2026-02-11'), details: { liters: 60, description: 'South van routine fill' } },
        ];

        // ── EXPENSES — MAINTENANCE (contributes to Operational Cost & Analytics) ────────
        const maintenanceExpenses = [
            { vehicle: veh('GHI-9012')._id, type: 'Maintenance', amount: 2400, date: new Date('2026-02-19'), details: { serviceType: 'Engine Repair', description: 'Timing belt and gasket replacement' } },
            { vehicle: veh('STU-6789')._id, type: 'Maintenance', amount: 1800, date: new Date('2026-02-15'), details: { serviceType: 'Transmission', description: 'Transmission fluid flush and filter change' } },
            { vehicle: veh('GHI-9012')._id, type: 'Maintenance', amount: 650, date: new Date('2026-02-05'), details: { serviceType: 'Brake Service', description: 'Front brake pads and rotors' } },
            { vehicle: veh('PQR-2345')._id, type: 'Maintenance', amount: 520, date: new Date('2026-02-08'), details: { serviceType: 'Brake Service', description: 'Rear drum brake adjustment and shoe replacement' } },
            { vehicle: veh('MNO-7890')._id, type: 'Maintenance', amount: 980, date: new Date('2026-01-25'), details: { serviceType: 'Transmission', description: 'Automatic gearbox service and fluid top-up' } },
            { vehicle: veh('DEF-5678')._id, type: 'Maintenance', amount: 420, date: new Date('2026-01-15'), details: { serviceType: 'AC Service', description: 'AC recharge and compressor check' } },
            { vehicle: veh('ABC-1234')._id, type: 'Maintenance', amount: 180, date: new Date('2026-02-10'), details: { serviceType: 'Oil Change', description: 'Full synthetic 5W-30 oil change' } },
            { vehicle: veh('PQR-2345')._id, type: 'Maintenance', amount: 290, date: new Date('2026-01-20'), details: { serviceType: 'Battery', description: 'Heavy-duty battery replacement' } },
            { vehicle: veh('ABC-1234')._id, type: 'Maintenance', amount: 120, date: new Date('2026-01-28'), details: { serviceType: 'Tire Rotation', description: 'Four-tyre rotation and pressure check' } },
            { vehicle: veh('VWX-0123')._id, type: 'Maintenance', amount: 260, date: new Date('2026-02-12'), details: { serviceType: 'AC Service', description: 'Cabin air filter and AC gas recharge' } },
            { vehicle: veh('STU-6789')._id, type: 'Maintenance', amount: 350, date: new Date('2026-02-22'), details: { serviceType: 'General Inspection', description: 'Full vehicle safety and mechanical inspection' } },
        ];

        await Expense.insertMany([...fuelExpenses, ...maintenanceExpenses]);
        const fuelTotal = fuelExpenses.reduce((s, e) => s + e.amount, 0);
        console.log(`   → Inserted ${fuelExpenses.length} fuel entries   (Total: $${fuelTotal})`);
        console.log(`   → Inserted ${maintenanceExpenses.length} maintenance expense entries`);

        // ── MAINTENANCE RECORDS ─────────────────────────────────────────────────────────
        console.log('🔧 Seeding maintenance records...');
        const maintenanceRecords = [
            { vehicle: veh('GHI-9012')._id, serviceType: 'Engine Repair', description: 'Replaced engine gaskets and timing belt', date: new Date('2026-02-19'), cost: 2400, status: 'In Progress' },
            { vehicle: veh('GHI-9012')._id, serviceType: 'Brake Service', description: 'Front brake pads and rotor replacement', date: new Date('2026-02-05'), cost: 650, status: 'Completed' },
            { vehicle: veh('STU-6789')._id, serviceType: 'Transmission', description: 'Transmission fluid flush and filter change', date: new Date('2026-02-15'), cost: 1800, status: 'Scheduled' },
            { vehicle: veh('STU-6789')._id, serviceType: 'General Inspection', description: 'Full vehicle inspection before return to service', date: new Date('2026-02-22'), cost: 350, status: 'Scheduled' },
            { vehicle: veh('ABC-1234')._id, serviceType: 'Oil Change', description: 'Full synthetic oil change and filter replacement', date: new Date('2026-02-10'), cost: 180, status: 'Completed' },
            { vehicle: veh('ABC-1234')._id, serviceType: 'Tire Rotation', description: 'Tire rotation and wheel alignment check', date: new Date('2026-01-28'), cost: 120, status: 'Completed' },
            { vehicle: veh('DEF-5678')._id, serviceType: 'AC Service', description: 'Air conditioning recharge and compressor check', date: new Date('2026-01-15'), cost: 420, status: 'Completed' },
            { vehicle: veh('PQR-2345')._id, serviceType: 'Brake Service', description: 'Rear drum brake adjustment and shoe replacement', date: new Date('2026-02-08'), cost: 520, status: 'Completed' },
            { vehicle: veh('PQR-2345')._id, serviceType: 'Battery', description: 'Battery replacement – 12V 100Ah heavy duty', date: new Date('2026-01-20'), cost: 290, status: 'Completed' },
            { vehicle: veh('MNO-7890')._id, serviceType: 'Transmission', description: 'Automatic gearbox service and fluid top-up', date: new Date('2026-01-25'), cost: 980, status: 'Completed' },
            { vehicle: veh('VWX-0123')._id, serviceType: 'AC Service', description: 'Cabin air filter replacement and AC gas recharge', date: new Date('2026-02-12'), cost: 260, status: 'Completed' },
            { vehicle: veh('JKL-3456')._id, serviceType: 'General Inspection', description: '6-month scheduled safety and mechanical inspection', date: new Date('2026-02-09'), cost: 200, status: 'Completed' },
        ];
        await Maintenance.insertMany(maintenanceRecords);
        const maintenanceCost = maintenanceRecords.reduce((s, m) => s + m.cost, 0);
        console.log(`   → Inserted ${maintenanceRecords.length} maintenance records  (Total: $${maintenanceCost})`);

        console.log('\n🎉 Database fully seeded!');
        console.log('   Vehicles     : ' + seededVehicles.length);
        console.log('   Drivers      : ' + seededDrivers.length);
        console.log('   Trips        : ' + seededTrips.length + '  (2 Dispatched | 1 Draft | 1 Cancelled | 4 Completed)');
        console.log('   Fuel Expenses: ' + fuelExpenses.length + '  ($' + fuelExpenses.reduce((s, e) => s + e.amount, 0) + ' total, ' + fuelExpenses.reduce((s, e) => s + e.details.liters, 0) + 'L)');
        console.log('   Maint Expense: ' + maintenanceExpenses.length);
        console.log('   Maintenance  : ' + maintenanceRecords.length);
        process.exit(0);

    } catch (err) {
        console.error('❌ SEED ERROR:', err);
        process.exit(1);
    }
};

seedDB();
