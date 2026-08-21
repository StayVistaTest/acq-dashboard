import { getSheetData, parseRows } from "@/lib/sheets";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const rows = await getSheetData("Agreement Summary!A:J");
    const data = parseRows(rows);
    const cleaned = data.filter((r) => r["Property ID"] || r["Supply Master Property ID"]).map((r) => ({
      id: r["Property ID"] || r["Supply Master Property ID"] || "",
      name: r["Vista Name"] || "",
      poc: r["Acquisition POC"] || "",
      contractStatus: r["Contract status"] || "",
      agreementTermPeriod: r["Agreement Term Period"] || "",
      lockInPeriod: r["Lock in period"] || "",
      terminationPenalty: r["Termination penalty during lock-in (Amount) (Rs.)"] || "",
    }));
    return NextResponse.json({ data: cleaned });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
