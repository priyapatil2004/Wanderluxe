require('dotenv').config();

const mongoose = require('mongoose');
const Listing = require('./models/listing'); 
const { data } = require('./init/data'); 

const dbUrl = process.env.ATLASDB_URL || 'mongodb://127.0.0.1:27017/wanderluxe';


const dummyUserId = '68556ff3773dd24c045829b9';

mongoose.connect(dbUrl)
    .then(() => {
        console.log("Mongo connection open!!");
    })
    .catch(err => {
        console.log("Mongo connection error!!");
        console.log(err);
    });

const seedDB = async () => {
    await Listing.deleteMany({});
    
    for (let i = 0; i < data.length; i++) {
        const listing = new Listing(data[i]);
        listing.owner = dummyUserId; // assigning a dummy owner to each listing
        await listing.save();
    }

    console.log("Database seeded!");
};

seedDB().then(() => {
    mongoose.connection.close();
});

