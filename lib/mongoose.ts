import mongoose, { ConnectOptions } from "mongoose";

let isConnected = false

export const connectDatabase = async () => {
    mongoose.set("strictQuery", true);
    if (!process.env.DATABASE_URL) {
        return console.error("MONGO_URI is not defined");
    }
    if (isConnected) {
        return;
    }
    try {
        const options: ConnectOptions = {
            dbName: "next-auth",
            autoCreate: true
        }

        await mongoose.connect(process.env.DATABASE_URL, options);
        isConnected = true;
        console.log("Connected to database");
    } catch (error) {
        console.log("Error connecting to database");
    }
}