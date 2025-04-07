import mongoose from 'mongoose';
const MONGODB_URI= process.env.MONGODB_URI;
let cached =(global as any ).mongoose || { conn:null , promise:null};
export const connectToDatabase = async()=>{
    if(cached.conn) return cached.conn;
    if(!MONGODB_URI) throw new Error ('MONGODB_URI is Missing!');
    cached.promise = cached.promise || mongoose.connect(MONGODB_URI,
    {
        dbName: 'defilab',
        bufferCommands: false,
        connectTimeoutMS: 30000, // 30 seconds timeout
        socketTimeoutMS: 45000, // 45 seconds socket timeout
        serverSelectionTimeoutMS: 5000 // 5 seconds server selection timeout
    });
    
    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null; // Reset promise on error
        throw error;
    }
}
