"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
const COLORS = ["#9CCCFB","#E9A0A7","#FCD4A8","#86EFAC","#C4B5FD","#FCA5A5","#6EE7B7","#93C5FD"];
export default function LiveRoomCount({ supplyData, filters }) {
  if (!supplyData) return null;
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const liveThisMonth = supplyData.filter((p) => {
    if (!p.liveDateParsed) return false;
    const d = new Date(p.liveDateParsed);
    return d.getMonth()+1===filters.month && d.getFullYear()===filters.year && (filters.poc==="all"||p.poc===filters.poc);
  });
  const byPOC = {};
  liveThisMonth.forEach((p) => { const poc=p.poc||"Unassigned"; byPOC[poc]=(byPOC[poc]||0)+p.rooms; });
  const chartData = Object.entries(byPOC).map(([poc,rooms])=>({poc,rooms})).sort((a,b)=>b.rooms-a.rooms);
  const totalRooms = chartData.reduce((s,d)=>s+d.rooms,0);
  return (
    <section>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"1.25rem",flexWrap:"wrap",gap:"1rem"}}>
        <div>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:"1.25rem",color:"#1E1E1E",margin:0}}>Live Room Count</h2>
          <p style={{fontSize:"0.875rem",color:"#9ca3af",marginTop:"0.25rem"}}>Properties that went live in {MONTHS[filters.month-1]} {filters.year}</p>
        </div>
        <div style={{display:"flex",gap:"1rem",textAlign:"right"}}>
          <div><p style={{fontSize:"1.5rem",fontWeight:600,margin:0}}>{totalRooms}</p><p style={{fontSize:"0.7rem",color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.05em"}}>Total Rooms</p></div>
          <div style={{borderLeft:"1px solid #e5e7eb",paddingLeft:"1rem"}}><p style={{fontSize:"1.5rem",fontWeight:600,margin:0}}>{liveThisMonth.length}</p><p style={{fontSize:"0.7rem",color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.05em"}}>Properties</p></div>
        </div>
      </div>
      {chartData.length===0 ? (
        <div style={{background:"white",borderRadius:"1rem",border:"1px solid #f3f4f6",padding:"3rem",textAlign:"center"}}>
          <p style={{color:"#9ca3af",fontSize:"0.875rem"}}>No properties went live in {MONTHS[filters.month-1]} {filters.year}</p>
        </div>
      ) : (
        <div style={{background:"white",borderRadius:"1rem",border:"1px solid #f3f4f6",padding:"1.5rem",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
              <XAxis dataKey="poc" tick={{fontSize:11,fill:"#6b7280"}} tickLine={false} axisLine={false}/>
              <YAxis tick={{fontSize:11,fill:"#9ca3af"}} tickLine={false} axisLine={false} allowDecimals={false}/>
              <Tooltip contentStyle={{borderRadius:8,border:"none",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}} formatter={(val)=>[`${val} rooms`,"Rooms"]}/>
              <Bar dataKey="rooms" radius={[6,6,0,0]}>{chartData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{marginTop:"1rem",borderTop:"1px solid #f3f4f6",paddingTop:"1rem",overflowX:"auto"}}>
            <table className="w-full data-table" style={{whiteSpace:"nowrap"}}>
              <thead><tr><th>Acquisition POC</th><th>Properties</th><th>Total Rooms</th></tr></thead>
              <tbody>{chartData.map(({poc,rooms})=>{
                const count=liveThisMonth.filter((p)=>(p.poc||"Unassigned")===poc).length;
                return <tr key={poc}><td style={{fontWeight:500}}>{poc}</td><td>{count}</td><td style={{fontWeight:500}}>{rooms}</td></tr>;
              })}</tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
