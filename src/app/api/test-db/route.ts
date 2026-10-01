import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const rawUri = process.env.MONGODB_URI;
  const uri = rawUri?.trim();

  if (!uri) {
    return NextResponse.json({
      ok: false,
      error: "MONGODB_URI environment variable is missing or empty in Vercel environment settings.",
    });
  }

  // Mask password for safety in output
  const maskedUri = uri.replace(/\/\/(.*?):(.*?)@/, "//$1:****@");

  try {
    const conn = await mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });

    const isConnected = conn.connection.readyState === 1;

    // Ping database
    let pingResult = false;
    if (isConnected && conn.connection.db) {
      const ping = await conn.connection.db.admin().ping();
      pingResult = !!ping.ok;
    }

    return NextResponse.json({
      ok: true,
      status: "CONNECTED",
      databaseName: conn.connection.name,
      readyState: conn.connection.readyState,
      ping: pingResult,
      uri: maskedUri,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      {
        ok: false,
        status: "FAILED",
        errorName: error.name,
        errorMessage: error.message,
        uri: maskedUri,
        possibleReasons: [
          "1. MongoDB Atlas Network Access (IP Whitelist): You must add 0.0.0.0/0 in MongoDB Atlas -> Network Access so Vercel dynamic IPs can connect.",
          "2. Database Password/User Special Characters: Password containing special characters like # must be URL encoded (e.g., # as %23).",
          "3. Environment Variable Name: Ensure Key is exact 'MONGODB_URI' in Vercel settings.",
        ],
      },
      { status: 500 }
    );
  }
}
