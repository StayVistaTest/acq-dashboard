import { getSheetData, parseDate } from "@/lib/sheets";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const rows = await getSheetData("Supply master!A:BJ");
    if (!rows || rows.length < 3) return NextResponse.json({ data: [] });
    // Row 0 = column numbers (skip)
    // Row 1 = actual headers
    // Row 2+ = data
    const headers = rows[1].map((h) => h?.trim() || "");
    const pocIdx = headers.findIndex(h => h.toLowerCase().includes("acquisition poc"));
    const nameIdx = headers.findIndex(h => h.toLowerCase() === "vista name");
    const idIdx = headers.findIndex(h => h.toLowerCase().includes("supply master property id"));
    const cityIdx = headers.findIndex(h => h.toLowerCase() === "city");
    const squadIdx = headers.findIndex(h => h.toLowerCase() === "squad");
    const statusIdx = headers.findIndex(h => h.toLowerCase() === "current status");
    const liveDateIdx = headers.findIndex(h => h.toLowerCase() === "live date");
    const roomsIdx = headers.findIndex(h => h.toLowerCase() === "no of rooms");
    const contractIdx = headers.findIndex(h => h.toLowerCase() === "contract status");
    const agrStartIdx = headers.findIndex(h => h.toLowerCase() === "agreement start date");
    const agrEndIdx = headers.findIndex(h => h.toLowerCase() === "agreement end date");
    const lockInIdx = headers.findIndex(h => h.toLowerCase() === "agreement lock in date");
    const get = (row, idx) => idx !== -1 ? (row[idx]?.trim() || "") : "";
    const cleaned = rows.slice(2)
      .filter(row => get(row, idIdx))
      .map(row => ({
        id: get(row, idIdx),
        name: get(row, nameIdx),
        city: get(row, cityIdx),
        squad: get(row, squadIdx),
        status: get(row, statusIdx),
        liveDate: get(row, liveDateIdx),
        liveDateParsed: parseDate(get(row, liveDateIdx)),
        rooms: parseInt(get(row, roomsIdx)) || 0,
        contractStatus: get(row, contractIdx),
        agreementStart: get(row, agrStartIdx),
        agreementEnd: get(row, agrEndIdx),
        lockIn: get(row, lockInIdx),
        poc: get(row, pocIdx),
        propertyType: "",
      }));
    return NextResponse.json({ data: cleaned });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
