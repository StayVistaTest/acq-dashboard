import { getSheetData } from "@/lib/sheets";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const rows = await getSheetData("List of Acquisition POCs!A:C");
    if (!rows || rows.length < 2) return NextResponse.json({ pocs: [] });
    const headers = rows[0].map((h) => h?.trim().toLowerCase());
    // Try to find "employee name" column, fall back to any "name" column
    let nameIdx = headers.findIndex((h) => h.includes("employee name") || h === "name");
    if (nameIdx === -1) nameIdx = headers.findIndex((h) => h.includes("name"));
    if (nameIdx === -1) nameIdx = 1; // default to column B
    const pocs = rows
      .slice(1)
      .map((r) => r[nameIdx]?.trim())
      .filter(Boolean)
      .sort();
    return NextResponse.json({ pocs: [...new Set(pocs)] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
