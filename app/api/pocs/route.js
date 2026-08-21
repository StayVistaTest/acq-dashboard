import { getSheetData } from "@/lib/sheets";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const rows = await getSheetData("Supply master!BG:BG");
    const pocs = [...new Set(rows.slice(1).map((r) => r[0]?.trim()).filter(Boolean))].sort();
    return NextResponse.json({ pocs });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
