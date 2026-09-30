/** ===================================================
 * ⚙️ BACKEND API: Admin Staff Management Endpoint (POST /api/admin/staff-manage)
 * Handles Edit, Delete, & Active/Inactive Toggle operations
 * =================================================== */
import { NextResponse } from "next/server";
import { verify, COOKIE } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { StaffUser } from "@/lib/models/StaffUser";
import { AccessLog } from "@/lib/models/AccessLog";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // 1. Verify Admin Session
    const authHeader = req.headers.get("cookie");
    const cookiesArr = authHeader?.split(";").map((c) => c.trim()) ?? [];
    const cookieVal = cookiesArr.find((c) => c.startsWith(`${COOKIE}=`))?.split("=")[1];
    const session = cookieVal ? await verify(cookieVal) : null;

    if (!session || session.r !== "admin") {
      return NextResponse.json({ ok: false, error: "Unauthorized. Admin privileges required." }, { status: 401 });
    }

    const body = await req.json();
    const action = String(body.action ?? "").trim();
    const id = String(body.id ?? body._id ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const db = await dbConnect();

    if (!db) {
      return NextResponse.json({ ok: false, error: "Database connection unavailable." }, { status: 500 });
    }

    // ----------------------------------------------------
    // ACTION 1: TOGGLE STATUS (Active <-> Inactive)
    // ----------------------------------------------------
    if (action === "toggle_status") {
      const newStatus = String(body.status ?? "active").toLowerCase() === "active" ? "active" : "inactive";
      
      const updated = await StaffUser.findOneAndUpdate(
        id ? { _id: id } : { email },
        { status: newStatus },
        { new: true }
      );

      if (!updated) {
        return NextResponse.json({ ok: false, error: "Staff member not found." }, { status: 404 });
      }

      await AccessLog.create({
        at: new Date(),
        event: "admin_toggle_staff_status",
        user: `${session.u} set ${updated.email} to ${newStatus}`,
        ip,
      });

      return NextResponse.json({
        ok: true,
        message: `Staff member '${updated.name}' is now ${newStatus.toUpperCase()}.`,
        user: updated,
      });
    }

    // ----------------------------------------------------
    // ACTION 2: EDIT STAFF MEMBER DETAILS
    // ----------------------------------------------------
    if (action === "update") {
      const name = String(body.name ?? "").trim();
      const phone = String(body.phone ?? "").trim();
      const role = String(body.role ?? "Manning & Crewing").trim();
      const status = String(body.status ?? "active").toLowerCase() === "active" ? "active" : "inactive";

      if (!name || !email) {
        return NextResponse.json({ ok: false, error: "Name and Email are required." }, { status: 400 });
      }

      const updated = await StaffUser.findOneAndUpdate(
        id ? { _id: id } : { email },
        { name, email, phone, role, status },
        { new: true }
      );

      if (!updated) {
        return NextResponse.json({ ok: false, error: "Staff member not found." }, { status: 404 });
      }

      await AccessLog.create({
        at: new Date(),
        event: "admin_update_staff",
        user: `${session.u} updated ${updated.email}`,
        ip,
      });

      return NextResponse.json({
        ok: true,
        message: `Staff details for '${updated.name}' updated successfully.`,
        user: updated,
      });
    }

    // ----------------------------------------------------
    // ACTION 3: DELETE STAFF MEMBER
    // ----------------------------------------------------
    if (action === "delete") {
      const deleted = await StaffUser.findOneAndDelete(id ? { _id: id } : { email });

      if (!deleted) {
        return NextResponse.json({ ok: false, error: "Staff member not found." }, { status: 404 });
      }

      await AccessLog.create({
        at: new Date(),
        event: "admin_delete_staff",
        user: `${session.u} deleted ${deleted.email}`,
        ip,
      });

      return NextResponse.json({
        ok: true,
        message: `Staff account '${deleted.name}' deleted successfully.`,
      });
    }

    return NextResponse.json({ ok: false, error: "Invalid action specified." }, { status: 400 });
  } catch (err: any) {
    console.error("❌ Staff management endpoint error:", err);
    return NextResponse.json({ ok: false, error: err?.message || "Server error" }, { status: 500 });
  }
}
