import { getSheetData } from "@/lib/sheets";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const rows = await getSheetData("Supply master!A:BJ");
    if (!rows || rows.length < 2) return NextResponse.json({ error: "no data" });
    const headers = rows[0];
    // Show all headers with their index
    const headerMap = headers.map((h, i) => ({ index: i, col: String.fromCharCode(65 + (i >= 26 ? 0 : i)) + (i >= 26 ? String.fromCharCode(65 + i - 26) : ""), header: h }));
    // Get POC values from last few columns
    const lastCols = rows.slice(1, 5).map(r => r.slice(55, 62));
    return NextResponse.json({ 
      totalRows: rows.length,
      headers: headerMap.slice(55, 62),
      sampleRows: lastCols
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
