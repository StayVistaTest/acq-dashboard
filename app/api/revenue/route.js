import { getSheetData, parseRows } from "@/lib/sheets";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const rows = await getSheetData("Revenue!A:J");
    const data = parseRows(rows);
    const cleaned = data.filter((r) => r["Supply Master Property ID"] || r["Property ID"]).map((r) => ({
      id: r["Supply Master Property ID"] || r["Property ID"] || "",
      name: r["Vista Name"] || "",
      poc: r["Acquisition POC"] || "",
      totalRevenue: parseFloat(r["Total Revenue"]) || 0,
      totalNights: parseInt(r["Total Nights"]) || 0,
    }));
    return NextResponse.json({ data: cleaned });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
