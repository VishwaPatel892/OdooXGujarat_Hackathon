const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');
const Trip = require('./models/Trip');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fleet-mgmt';

const seed = async () => {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const vehicles = await Vehicle.find().limit(6);
    const drivers = await Driver.find().limit(6);

    if (vehicles.length === 0 || drivers.length === 0) {
        console.log('Need vehicles and drivers first.');
        process.exit(1);
    }

    await Trip.deleteMany({});

    const trips = [
        { tripId: 'TR-1001', vehicle: vehicles[0]._id, driver: drivers[0]._id, origin: 'Los Angeles, CA', destination: 'San Francisco, CA', cargoWeight: 4500, status: 'Dispatched', dispatchDate: new Date('2026-02-20T08:00:00') },
        { tripId: 'TR-1002', vehicle: vehicles[1]?._id || vehicles[0]._id, driver: drivers[1]?._id || drivers[0]._id, origin: 'Houston, TX', destination: 'Dallas, TX', cargoWeight: 3200, status: 'Completed', dispatchDate: new Date('2026-02-18T06:30:00'), completionDate: new Date('2026-02-18T14:00:00') },
        { tripId: 'TR-1003', vehicle: vehicles[2]?._id || vehicles[0]._id, driver: drivers[2]?._id || drivers[0]._id, origin: 'Chicago, IL', destination: 'Detroit, MI', cargoWeight: 5800, status: 'Dispatched', dispatchDate: new Date('2026-02-21T09:15:00') },
        { tripId: 'TR-1004', vehicle: vehicles[3]?._id || vehicles[0]._id, driver: drivers[3]?._id || drivers[0]._id, origin: 'Miami, FL', destination: 'Atlanta, GA', cargoWeight: 2100, status: 'Completed', dispatchDate: new Date('2026-02-15T07:00:00'), completionDate: new Date('2026-02-15T18:30:00') },
        { tripId: 'TR-1005', vehicle: vehicles[4]?._id || vehicles[0]._id, driver: drivers[4]?._id || drivers[0]._id, origin: 'Seattle, WA', destination: 'Portland, OR', cargoWeight: 1800, status: 'Draft', dispatchDate: new Date('2026-02-22T10:00:00') },
        { tripId: 'TR-1006', vehicle: vehicles[5]?._id || vehicles[0]._id, driver: drivers[5]?._id || drivers[0]._id, origin: 'New York, NY', destination: 'Boston, MA', cargoWeight: 3900, status: 'Cancelled', dispatchDate: new Date('2026-02-17T05:45:00') },
        { tripId: 'TR-1007', vehicle: vehicles[0]._id, driver: drivers[1]?._id || drivers[0]._id, origin: 'Denver, CO', destination: 'Phoenix, AZ', cargoWeight: 6200, status: 'Dispatched', dispatchDate: new Date('2026-02-21T11:00:00') },
        { tripId: 'TR-1008', vehicle: vehicles[1]?._id || vehicles[0]._id, driver: drivers[2]?._id || drivers[0]._id, origin: 'Nashville, TN', destination: 'Memphis, TN', cargoWeight: 2800, status: 'Completed', dispatchDate: new Date('2026-02-14T08:30:00'), completionDate: new Date('2026-02-14T13:45:00') },
    ];

    await Trip.insertMany(trips);
    console.log('Seeded 8 trips!');
    process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
