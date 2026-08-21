import { getSheetData } from "@/lib/sheets";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const rows = await getSheetData("List of Acquisition POCs!A:A");
    const pocs = rows
      .slice(1)
      .map((r) => r[0]?.trim())
      .filter(Boolean)
      .sort();
    return NextResponse.json({ pocs: [...new Set(pocs)] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
