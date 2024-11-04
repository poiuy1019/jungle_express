const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB);
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB