import { getSheetData, parseRows } from "@/lib/sheets";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const rows = await getSheetData("Supply master!A:BJ");
    const data = parseRows(rows);
    const pocs = [...new Set(data.map(r => r["Acquisition POC"]).filter(Boolean))].sort();
    return NextResponse.json({ pocs, total: data.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
