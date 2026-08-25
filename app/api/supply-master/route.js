import { getSheetData, parseDate } from "@/lib/sheets";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const rows = await getSheetData("Supply master!A:BJ");
    if (!rows || rows.length < 3) return NextResponse.json({ data: [] });
    // Row 1 = column numbers, Row 2 = actual headers, Row 3+ = data
    const headers = rows[1].map((h) => h?.trim());
    const data = rows.slice(2).map((row) => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]?.trim() || ""; });
      return obj;
    });
    const cleaned = data
      .filter((r) => r["Supply Master Property ID"])
      .map((r) => ({
        id: r["Supply Master Property ID"],
        name: r["Vista Name"] || "",
        city: r["City"] || "",
        squad: r["Squad"] || "",
        status: r["Current Status"] || "",
        liveDate: r["Live date"] || "",
        liveDateParsed: parseDate(r["Live date"]),
        liveMonth: r["Live Month"] || "",
        liveYear: r["Live Year"] || "",
        rooms: parseInt(r["No of Rooms"]) || 0,
        contractStatus: r["Contract status"] || "",
        agreementStart: r["Agreement start date"] || "",
        agreementEnd: r["Agreement end date"] || "",
        lockIn: r["Agreement lock in date"] || "",
        poc: r["Acquisition POC"] || "",
        propertyType: r["Property Type"] || "",
      }));
    return NextResponse.json({ data: cleaned });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
