import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.error("Error Connecting MongoDB!", error);
        process.exit(1); // exit with failure
    }
};