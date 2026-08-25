"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
const METRIC_CONFIG = [
  {key:"leadActivation",label:"Lead Activations",color:"#9CCCFB"},
  {key:"leadGeneration",label:"Lead Generations",color:"#E9A0A7"},
  {key:"meetingsConducted",label:"Meetings Conducted",color:"#FCD4A8"},
  {key:"callsMade",label:"Calls Made",color:"#86EFAC"},
];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function getDateRanges() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Yesterday
  const yStart = new Date(today); yStart.setDate(today.getDate()-1);
  const yEnd = new Date(yStart);
  // This Week (Mon-today)
  const dayOfWeek = today.getDay();
  const diffMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const twStart = new Date(today); twStart.setDate(today.getDate()-diffMon);
  const twEnd = new Date(today);
  // Last Week
  const lwStart = new Date(twStart); lwStart.setDate(twStart.getDate()-7);
  const lwEnd = new Date(twStart); lwEnd.setDate(twStart.getDate()-1);
  // This Month
  const tmStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const tmEnd = new Date(today);
  return {
    yesterday: { start: yStart, end: yEnd },
    thisWeek: { start: twStart, end: twEnd },
    lastWeek: { start: lwStart, end: lwEnd },
    thisMonth: { start: tmStart, end: tmEnd },
  };
}
function fmt(d) { return d.toISOString().split("T")[0]; }
function countInRange(metricData, poc, start, end) {
  const days = poc === "all"
    ? Object.values(metricData).reduce((acc, pocDays) => {
        Object.entries(pocDays).forEach(([day, count]) => { acc[day] = (acc[day]||0)+count; });
        return acc;
      }, {})
    : (metricData[poc] || {});
  return Object.entries(days).reduce((sum, [day, count]) => {
    const d = new Date(start.getFullYear(), start.getMonth(), parseInt(day));
    if (d >= start && d <= end) return sum + count;
    return sum;
  }, 0);
}
export default function InputMetrics({ data, filters, allData }) {
  const [period, setPeriod] = useState("thisMonth");
  if (!data) return null;
  const ranges = getDateRanges();
  const activePOC = filters.poc;
  const allPOCs = new Set();
  METRIC_CONFIG.forEach(({key}) => Object.keys(data[key]||{}).forEach(poc => allPOCs.add(poc)));
  const pocRows = activePOC === "all" ? [...allPOCs].sort() : [activePOC];
  // KPI totals for selected period
  const range = ranges[period];
  const totals = {};
  METRIC_CONFIG.forEach(({key}) => {
    totals[key] = countInRange(data[key]||{}, activePOC, range.start, range.end);
  });
  // Daily chart data
  const daysInMonth = new Date(filters.year, filters.month, 0).getDate();
  const chartData = Array.from({length:daysInMonth},(_,i)=>{
    const day=i+1; const point={day:`${day}`};
    METRIC_CONFIG.forEach(({key,label})=>{
      const md=data[key]||{};
      if(activePOC==="all") point[label]=Object.values(md).reduce((sum,days)=>sum+(days[day]||0),0);
      else point[label]=(md[activePOC]?.[day])||0;
    });
    return point;
  });
  const periodLabels = { yesterday:"Yesterday", thisWeek:"This Week", lastWeek:"Last Week", thisMonth:"This Month" };
  return (
    <section>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem",flexWrap:"wrap",gap:"0.75rem"}}>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:"1.25rem",color:"#1E1E1E",margin:0}}>
          Input Metrics <span style={{fontSize:"0.875rem",fontWeight:400,color:"#9ca3af",marginLeft:"0.75rem"}}>{activePOC==="all"?"All POCs":activePOC}</span>
        </h2>
        <select value={period} onChange={(e)=>setPeriod(e.target.value)}
          style={{fontSize:"0.875rem",border:"1px solid #e5e7eb",borderRadius:"0.5rem",padding:"0.5rem 0.75rem",background:"white",cursor:"pointer"}}>
          {Object.entries(periodLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      {/* KPI Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1rem",marginBottom:"1.5rem"}}>
        {METRIC_CONFIG.map(({key,label,color})=>(
          <div key={key} style={{background:"white",borderRadius:"1rem",border:"1px solid #f3f4f6",padding:"1.25rem",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <p style={{fontSize:"0.7rem",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600,margin:0}}>{label}</p>
              <span style={{width:"0.75rem",height:"0.75rem",borderRadius:"50%",background:color,display:"inline-block"}}/>
            </div>
            <p style={{fontSize:"1.875rem",fontWeight:600,color:"#1E1E1E",margin:"0.5rem 0 0 0"}}>{totals[key].toLocaleString()}</p>
            <p style={{fontSize:"0.75rem",color:"#9ca3af",margin:"0.25rem 0 0 0"}}>{periodLabels[period]}</p>
          </div>
        ))}
      </div>
      {/* Daily Chart */}
      <div style={{background:"white",borderRadius:"1rem",border:"1px solid #f3f4f6",padding:"1.5rem",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",marginBottom:"1.5rem"}}>
        <p style={{fontSize:"0.875rem",fontWeight:500,color:"#4b5563",marginBottom:"1rem"}}>Daily Activity — {MONTHS[filters.month-1]} {filters.year}</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} barSize={6} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
            <XAxis dataKey="day" tick={{fontSize:11,fill:"#9ca3af"}} tickLine={false} axisLine={false}/>
            <YAxis tick={{fontSize:11,fill:"#9ca3af"}} tickLine={false} axisLine={false} allowDecimals={false}/>
            <Tooltip contentStyle={{borderRadius:8,border:"none",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}} labelFormatter={(l)=>`Day ${l}`}/>
            <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:12}}/>
            {METRIC_CONFIG.map(({label,color})=><Bar key={label} dataKey={label} fill={color} radius={[2,2,0,0]}/>)}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* POC Breakdown Table — all 4 periods */}
      <div style={{background:"white",borderRadius:"1rem",border:"1px solid #f3f4f6",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",overflow:"hidden"}}>
        <div style={{padding:"1rem 1.5rem",borderBottom:"1px solid #f3f4f6"}}>
          <p style={{fontSize:"0.875rem",fontWeight:500,color:"#374151",margin:0}}>POC Performance Summary</p>
        </div>
        <div style={{overflowX:"auto"}}>
          <table className="w-full data-table" style={{whiteSpace:"nowrap"}}>
            <thead>
              <tr>
                <th>Acquisition POC</th>
                <th>Metric</th>
                <th>Yesterday</th>
                <th>This Week</th>
                <th>Last Week</th>
                <th>This Month</th>
              </tr>
            </thead>
            <tbody>
              {pocRows.map((poc)=>(
                METRIC_CONFIG.map(({key,label,color},mi)=>(
                  <tr key={`${poc}-${key}`}>
                    {mi===0 && <td rowSpan={4} style={{fontWeight:600,color:"#1E1E1E",borderRight:"1px solid #f3f4f6",verticalAlign:"middle"}}>{poc}</td>}
                    <td style={{fontSize:"0.75rem"}}>
                      <span style={{display:"inline-flex",alignItems:"center",gap:"0.4rem"}}>
                        <span style={{width:"0.5rem",height:"0.5rem",borderRadius:"50%",background:color,display:"inline-block"}}/>
                        {label}
                      </span>
                    </td>
                    {["yesterday","thisWeek","lastWeek","thisMonth"].map(p=>(
                      <td key={p} style={{tabularNums:true,fontWeight:500}}>
                        {countInRange(data[key]||{}, poc, ranges[p].start, ranges[p].end)}
                      </td>
                    ))}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
