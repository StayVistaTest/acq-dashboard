import { getSheetData } from "@/lib/sheets";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const rows = await getSheetData("Revenue!A:J");
    return NextResponse.json({
      totalRows: rows.length,
      row0: rows[0],
      row1: rows[1],
      row2: rows[2],
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
