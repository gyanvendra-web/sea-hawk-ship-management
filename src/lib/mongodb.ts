/** ===================================================
 * ⚙️ BACKEND: MongoDB Atlas Database Connection Module
 * =================================================== */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/seahawk";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
  lastErrTime?: number;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function dbConnect(): Promise<typeof mongoose | null> {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection failed within last 10 seconds, fallback immediately without blocking for 1.5s
  if (cached.lastErrTime && Date.now() - cached.lastErrTime < 10000) {
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 1500,
      connectTimeoutMS: 1500,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log("✅ MongoDB Connected Successfully");
        cached.conn = m;
        return m;
      })
      .catch((err) => {
        console.warn("⚠️ MongoDB Connection Warning (Falling back to local storage):", err.message);
        cached.conn = null;
        cached.promise = null;
        cached.lastErrTime = Date.now();
        return null;
      });
  }

  try {
    const conn = await cached.promise;
    if (!conn) {
      cached.promise = null;
    }
    return conn;
  } catch (e) {
    cached.promise = null;
    cached.lastErrTime = Date.now();
    return null;
  }
}
