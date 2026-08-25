import { getSheetData } from "@/lib/sheets";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const rows = await getSheetData("Supply master!A:BJ");
    if (!rows || rows.length < 3) return NextResponse.json({ error: "no data" });
    const headers = rows[1].map((h) => h?.trim());
    // Find acquisition POC column index
    const pocIdx = headers.findIndex(h => h?.toLowerCase().includes("acquisition poc"));
    // Show sample rows with their POC values
    const samples = rows.slice(2, 10).map(r => ({
      id: r[0],
      name: r[1],
      poc: r[pocIdx],
      pocIdx
    }));
    return NextResponse.json({ pocIdx, headers: headers.slice(55, 65), samples });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
