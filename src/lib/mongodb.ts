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
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    console.warn("⚠️ MONGODB_URI environment variable is not defined");
    return null;
  }

  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        console.log("✅ MongoDB Connected Successfully");
        cached.conn = m;
        return m;
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err.message);
        cached.conn = null;
        cached.promise = null;
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
    return null;
  }
}
