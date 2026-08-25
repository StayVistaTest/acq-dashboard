"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const COLORS = ["#9CCCFB","#E9A0A7","#FCD4A8","#86EFAC","#C4B5FD","#FCA5A5"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getLast6Months() {
  const now = new Date();
  const result = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ month: d.getMonth() + 1, year: d.getFullYear(), label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}` });
  }
  return result;
}

export default function LiveRoomCount({ supplyData, filters }) {
  if (!supplyData) return null;

  const last6 = getLast6Months();
  const activePOC = filters.poc;

  // Filter by POC
  const pocData = activePOC === "all" ? supplyData : supplyData.filter(p => {
    const norm = s => s?.trim().toLowerCase().replace(/\s+/g," ") || "";
    return norm(p.poc) === norm(activePOC);
  });

  // All-time totals for selected POC (Live only)
  const liveProps = pocData.filter(p => p.status?.toLowerCase() === "live");
  const totalRooms = liveProps.reduce((s, p) => s + (p.rooms || 0), 0);
  const totalProperties = liveProps.length;

  // Last 6 months chart data
  const chartData = last6.map(({ month, year, label }) => {
    const liveThisMonth = pocData.filter(p => {
      if (!p.liveDateParsed) return false;
      const d = new Date(p.liveDateParsed);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    });
    return {
      label,
      Rooms: liveThisMonth.reduce((s, p) => s + (p.rooms || 0), 0),
      Properties: liveThisMonth.length,
    };
  });

  // By POC for table (current month filter)
  const liveThisMonth = pocData.filter(p => {
    if (!p.liveDateParsed) return false;
    const d = new Date(p.liveDateParsed);
    return d.getMonth() + 1 === filters.month && d.getFullYear() === filters.year;
  });
  const byPOC = {};
  liveThisMonth.forEach(p => {
    const poc = p.poc || "Unassigned";
    if (!byPOC[poc]) byPOC[poc] = { rooms: 0, count: 0 };
    byPOC[poc].rooms += p.rooms || 0;
    byPOC[poc].count += 1;
  });
  const tableData = Object.entries(byPOC).sort((a, b) => b[1].rooms - a[1].rooms);

  return (
    <section>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"1.25rem",flexWrap:"wrap",gap:"1rem"}}>
        <div>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:"1.25rem",color:"#1E1E1E",margin:0}}>Live Room Count</h2>
          <p style={{fontSize:"0.875rem",color:"#9ca3af",marginTop:"0.25rem"}}>
            {activePOC === "all" ? "All POCs" : activePOC} · All-time live properties
          </p>
        </div>
        <div style={{display:"flex",gap:"1.5rem",textAlign:"right"}}>
          <div>
            <p style={{fontSize:"2rem",fontWeight:700,margin:0,color:"#1E1E1E"}}>{totalRooms}</p>
            <p style={{fontSize:"0.7rem",color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.05em",margin:0}}>Total Live Rooms</p>
          </div>
          <div style={{borderLeft:"1px solid #e5e7eb",paddingLeft:"1.5rem"}}>
            <p style={{fontSize:"2rem",fontWeight:700,margin:0,color:"#1E1E1E"}}>{totalProperties}</p>
            <p style={{fontSize:"0.7rem",color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.05em",margin:0}}>Live Properties</p>
          </div>
        </div>
      </div>

      {/* Last 6 months bar chart */}
      <div style={{background:"white",borderRadius:"1rem",border:"1px solid #f3f4f6",padding:"1.5rem",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",marginBottom:"1.5rem"}}>
        <p style={{fontSize:"0.875rem",fontWeight:500,color:"#4b5563",marginBottom:"1rem"}}>Properties Gone Live — Last 6 Months</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barSize={28} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
            <XAxis dataKey="label" tick={{fontSize:11,fill:"#6b7280"}} tickLine={false} axisLine={false}/>
            <YAxis tick={{fontSize:11,fill:"#9ca3af"}} tickLine={false} axisLine={false} allowDecimals={false}/>
            <Tooltip contentStyle={{borderRadius:8,border:"none",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}/>
            <Bar dataKey="Properties" fill="#9CCCFB" radius={[4,4,0,0]} name="Properties"/>
            <Bar dataKey="Rooms" fill="#FCD4A8" radius={[4,4,0,0]} name="Rooms"/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly table */}
      {tableData.length > 0 && (
        <div style={{background:"white",borderRadius:"1rem",border:"1px solid #f3f4f6",padding:"1.5rem",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
          <p style={{fontSize:"0.875rem",fontWeight:500,color:"#4b5563",marginBottom:"1rem"}}>
            {MONTHS[filters.month-1]} {filters.year} · Properties Gone Live
          </p>
          <table className="w-full data-table">
            <thead><tr><th>Acquisition POC</th><th>Properties</th><th>Total Rooms</th></tr></thead>
            <tbody>
              {tableData.map(([poc, d]) => (
                <tr key={poc}>
                  <td style={{fontWeight:500}}>{poc}</td>
                  <td>{d.count}</td>
                  <td style={{fontWeight:500}}>{d.rooms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
