// app/api/admin/route.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Wraps your GET handler so req.auth is populated
export const GET = auth((req) => {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  console.log("Authenticated user:", req.auth.user);
  // req.auth.user is available here
  return NextResponse.json({ data: "secret data" });
});
