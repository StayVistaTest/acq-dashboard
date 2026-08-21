"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
const METRIC_CONFIG = [
  {key:"leadActivation",label:"Lead Activations",color:"#9CCCFB"},
  {key:"leadGeneration",label:"Lead Generations",color:"#E9A0A7"},
  {key:"meetingsConducted",label:"Meetings Conducted",color:"#FCD4A8"},
  {key:"callsMade",label:"Calls Made",color:"#86EFAC"},
];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export default function InputMetrics({ data, filters }) {
  if (!data) return null;
  const allPOCs = new Set();
  METRIC_CONFIG.forEach(({key})=>Object.keys(data[key]||{}).forEach((poc)=>allPOCs.add(poc)));
  const activePOC = filters.poc;
  const totals = {};
  METRIC_CONFIG.forEach(({key})=>{
    const md=data[key]||{};
    if(activePOC==="all") totals[key]=Object.values(md).reduce((sum,days)=>sum+Object.values(days).reduce((s,v)=>s+v,0),0);
    else totals[key]=Object.values(md[activePOC]||{}).reduce((s,v)=>s+v,0);
  });
  const daysInMonth = new Date(filters.year,filters.month,0).getDate();
  const chartData = Array.from({length:daysInMonth},(_,i)=>{
    const day=i+1; const point={day:`${day}`};
    METRIC_CONFIG.forEach(({key,label})=>{
      const md=data[key]||{};
      if(activePOC==="all") point[label]=Object.values(md).reduce((sum,days)=>sum+(days[day]||0),0);
      else point[label]=(md[activePOC]?.[day])||0;
    });
    return point;
  });
  const pocRows = activePOC==="all" ? [...allPOCs].sort() : [activePOC];
  return (
    <section>
      <h2 style={{fontFamily:"Georgia,serif",fontSize:"1.25rem",color:"#1E1E1E",marginBottom:"1.25rem"}}>
        Input Metrics <span style={{fontSize:"0.875rem",fontWeight:400,color:"#9ca3af",marginLeft:"0.75rem"}}>{activePOC==="all"?"All POCs":activePOC}</span>
      </h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1rem",marginBottom:"1.5rem"}}>
        {METRIC_CONFIG.map(({key,label,color})=>(
          <div key={key} style={{background:"white",borderRadius:"1rem",border:"1px solid #f3f4f6",padding:"1.25rem",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <p style={{fontSize:"0.7rem",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600,margin:0}}>{label}</p>
              <span style={{width:"0.75rem",height:"0.75rem",borderRadius:"50%",background:color,display:"inline-block"}}/>
            </div>
            <p style={{fontSize:"1.875rem",fontWeight:600,color:"#1E1E1E",margin:"0.5rem 0 0 0"}}>{totals[key].toLocaleString()}</p>
          </div>
        ))}
      </div>
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
      {activePOC==="all" && pocRows.length>0 && (
        <div style={{background:"white",borderRadius:"1rem",border:"1px solid #f3f4f6",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",overflow:"hidden"}}>
          <div style={{padding:"1rem 1.5rem",borderBottom:"1px solid #f3f4f6"}}><p style={{fontSize:"0.875rem",fontWeight:500,color:"#374151",margin:0}}>POC-wise Breakdown</p></div>
          <div style={{overflowX:"auto"}}>
            <table className="w-full data-table" style={{whiteSpace:"nowrap"}}>
              <thead><tr><th>Acquisition POC</th>{METRIC_CONFIG.map(({label})=><th key={label}>{label}</th>)}</tr></thead>
              <tbody>{pocRows.map((poc)=>(
                <tr key={poc}><td style={{fontWeight:500}}>{poc}</td>
                {METRIC_CONFIG.map(({key})=>{const val=Object.values(data[key]?.[poc]||{}).reduce((s,v)=>s+v,0);return <td key={key}>{val}</td>;})}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
