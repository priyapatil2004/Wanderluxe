const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL='mongodb://127.0.0.1:27017/WanderLuxe';

// Database connection
async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");
    } catch (err) {
        console.error("Error connecting to DB:", err);
    }
}
main();


const initDB=async () => {
    await Listing.deleteMany({});       //to delete previously existing data
    initData.data=initData.data.map((obj)=>({...obj, owner:"684979e6ba97f794a84fb026" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
