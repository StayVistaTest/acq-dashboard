import { getSheetData, parseDate } from "@/lib/sheets";
import { NextResponse } from "next/server";
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get("month") || new Date().getMonth() + 1);
    const year = parseInt(searchParams.get("year") || new Date().getFullYear());
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const rows = await getSheetData("Input Metrics!A:P");
    if (!rows || rows.length < 3) return NextResponse.json({ data: {} });
    const dataRows = rows.slice(2);
    function inRange(dateStr) {
      const d = parseDate(dateStr);
      if (!d) return false;
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23,59,59,999);
        return d >= start && d <= end;
      }
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    }
    function getDay(dateStr) {
      const d = parseDate(dateStr);
      return d ? d.getDate() : null;
    }
    const metrics = { leadActivation:{}, leadGeneration:{}, meetingsConducted:{}, callsMade:{} };
    function increment(metric, poc, day) {
      if (!poc || !day) return;
      if (!metrics[metric][poc]) metrics[metric][poc] = {};
      metrics[metric][poc][day] = (metrics[metric][poc][day] || 0) + 1;
    }
    for (const row of dataRows) {
      const get = (idx) => row[idx]?.trim() || "";
      const laDate=get(0); const laBy=get(1);
      if (laDate && laBy && inRange(laDate)) increment("leadActivation", laBy, getDay(laDate));
      const lgDate=get(4); const lgBy=get(5); const lgSource=get(6).toLowerCase();
      if (lgDate && lgBy && inRange(lgDate) && lgSource !== "inbound") increment("leadGeneration", lgBy, getDay(lgDate));
      const mDate=get(9); const mOwner=get(10); const mStatus=get(11).toLowerCase();
      if (mDate && mOwner && inRange(mDate) && mStatus === "completed") increment("meetingsConducted", mOwner, getDay(mDate));
      const cDate=get(14); const cOwner=get(15);
      if (cDate && cOwner && inRange(cDate)) increment("callsMade", cOwner, getDay(cDate));
    }
    return NextResponse.json({ data: metrics, month, year });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
