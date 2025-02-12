import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const NO_URI_ERR = 'Please define the MONGODB_URI environment variable inside .env.local';

if (!MONGODB_URI) console.error(NO_URI_ERR);

export async function connect() {
    if (!MONGODB_URI) {
        console.error(NO_URI_ERR);
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI);
    } catch (error) {
        console.error('Error connecting to MongoDB: ', error);
    }
};