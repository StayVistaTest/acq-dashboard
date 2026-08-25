import { getSheetData, parseDate } from "@/lib/sheets";
import { NextResponse } from "next/server";
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get("month") || new Date().getMonth() + 1);
    const year = parseInt(searchParams.get("year") || new Date().getFullYear());
    const rows = await getSheetData("Input Metrics!A:P");
    if (!rows || rows.length < 3) return NextResponse.json({ data: {} });
    // Headers are in row 2 (index 1), data starts from row 3 (index 2)
    const dataRows = rows.slice(2);
    // Fixed column indices (0-based)
    // Lead Activation: A=0, B=1
    // Lead Generated: E=4, F=5, G=6
    // Meetings: J=9, K=10, L=11
    // Calls: O=14, P=15
    function inMonth(dateStr) {
      const d = parseDate(dateStr);
      if (!d) return false;
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    }
    function getDay(dateStr) {
      const d = parseDate(dateStr);
      return d ? d.getDate() : null;
    }
    const metrics = { leadActivation: {}, leadGeneration: {}, meetingsConducted: {}, callsMade: {} };
    function increment(metric, poc, day) {
      if (!poc || !day) return;
      if (!metrics[metric][poc]) metrics[metric][poc] = {};
      metrics[metric][poc][day] = (metrics[metric][poc][day] || 0) + 1;
    }
    for (const row of dataRows) {
      const get = (idx) => row[idx]?.trim() || "";
      // Lead Activation
      const laDate = get(0); const laBy = get(1);
      if (laDate && laBy && inMonth(laDate)) increment("leadActivation", laBy, getDay(laDate));
      // Lead Generation (exclude Inbound)
      const lgDate = get(4); const lgBy = get(5); const lgSource = get(6).toLowerCase();
      if (lgDate && lgBy && inMonth(lgDate) && lgSource !== "inbound") increment("leadGeneration", lgBy, getDay(lgDate));
      // Meetings (only Completed)
      const mDate = get(9); const mOwner = get(10); const mStatus = get(11).toLowerCase();
      if (mDate && mOwner && inMonth(mDate) && mStatus === "completed") increment("meetingsConducted", mOwner, getDay(mDate));
      // Calls
      const cDate = get(14); const cOwner = get(15);
      if (cDate && cOwner && inMonth(cDate)) increment("callsMade", cOwner, getDay(cDate));
    }
    return NextResponse.json({ data: metrics, month, year });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
