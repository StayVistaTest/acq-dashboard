import { getSheetData } from "@/lib/sheets";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const rows = await getSheetData("Revenue!A:J");
    if (!rows || rows.length < 2) return NextResponse.json({ data: [] });
    // row0=empty, row1=headers, row2+=data
    const headers = rows[1].map(h => h?.trim() || "");
    const idIdx = headers.findIndex(h => h.toLowerCase().includes("property id"));
    const revenueIdx = headers.findIndex(h => h.toLowerCase().includes("total revenue"));
    const nightsIdx = headers.findIndex(h => h.toLowerCase().includes("total nights"));
    const pocIdx = headers.findIndex(h => h.toLowerCase().includes("acquisition poc"));
    const get = (row, idx) => idx !== -1 ? (row[idx]?.trim() || "") : "";
    const cleaned = rows.slice(2)
      .filter(row => get(row, idIdx))
      .map(row => ({
        id: get(row, idIdx),
        poc: get(row, pocIdx),
        totalRevenue: parseFloat(get(row, revenueIdx).replace(/,/g,"")) || 0,
        totalNights: parseInt(get(row, nightsIdx)) || 0,
      }));
    return NextResponse.json({ data: cleaned });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
