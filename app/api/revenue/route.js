import { getSheetData } from "@/lib/sheets";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const rows = await getSheetData("Revenue!A:J");
    if (!rows || rows.length < 2) return NextResponse.json({ data: [] });
    // Check if row 0 is headers or numbers
    const firstCell = rows[0][0]?.trim();
    const isNumberRow = !isNaN(firstCell);
    const headerRow = isNumberRow ? rows[1] : rows[0];
    const dataStart = isNumberRow ? 2 : 1;
    const headers = headerRow.map(h => h?.trim() || "");
    const idIdx = headers.findIndex(h => h.toLowerCase().includes("property id"));
    const revenueIdx = headers.findIndex(h => h.toLowerCase().includes("total revenue"));
    const nightsIdx = headers.findIndex(h => h.toLowerCase().includes("total nights"));
    const pocIdx = headers.findIndex(h => h.toLowerCase().includes("acquisition poc"));
    const get = (row, idx) => idx !== -1 ? (row[idx]?.trim() || "") : "";
    const cleaned = rows.slice(dataStart)
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
