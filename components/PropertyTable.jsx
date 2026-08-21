"use client";
import { useState } from "react";
const STATUS_STYLES = {"live":"background:#dcfce7;color:#166534","delisted":"background:#fee2e2;color:#991b1b","paused":"background:#fef3c7;color:#92400e","handed over":"background:#f3f4f6;color:#4b5563","tac":"background:#ede9fe;color:#5b21b6","never went live":"background:#f3f4f6;color:#6b7280"};
function StatusChip({status}) {
  const s=status?.toLowerCase()||"";
  const style=STATUS_STYLES[s]||"background:#f3f4f6;color:#4b5563";
  return <span style={{...Object.fromEntries(style.split(";").map(p=>p.split(":").map(x=>x.trim())).filter(p=>p.length===2).map(([k,v])=>[k.replace(/-([a-z])/g,(_,l)=>l.toUpperCase()),v])),display:"inline-flex",padding:"0.15rem 0.5rem",borderRadius:"9999px",fontSize:"0.75rem",fontWeight:500}}>{status||"—"}</span>;
}
export default function PropertyTable({ supplyData, revenueData, agreementData, filters }) {
  const [search, setSearch] = useState("");
  if (!supplyData) return null;
  const revenueMap = {};
  (revenueData||[]).forEach((r)=>{revenueMap[r.id]=r;});
  const agreementMap = {};
  (agreementData||[]).forEach((a)=>{agreementMap[a.id]=a;});
  let properties = supplyData.filter((p)=>filters.poc==="all"||p.poc===filters.poc);
  if (search) { const q=search.toLowerCase(); properties=properties.filter((p)=>p.name.toLowerCase().includes(q)||p.city.toLowerCase().includes(q)||p.poc.toLowerCase().includes(q)); }
  return (
    <section>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem",flexWrap:"wrap",gap:"0.75rem"}}>
        <div>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:"1.25rem",color:"#1E1E1E",margin:0}}>Property Overview</h2>
          <p style={{fontSize:"0.875rem",color:"#9ca3af",marginTop:"0.25rem"}}>{properties.length} properties{filters.poc!=="all"&&` · ${filters.poc}`}</p>
        </div>
        <input type="text" placeholder="Search property or city…" value={search} onChange={(e)=>setSearch(e.target.value)}
          style={{fontSize:"0.875rem",border:"1px solid #e5e7eb",borderRadius:"0.5rem",padding:"0.5rem 1rem",width:"16rem",outline:"none",background:"white"}}/>
      </div>
      <div style={{background:"white",borderRadius:"1rem",border:"1px solid #f3f4f6",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table className="w-full data-table" style={{whiteSpace:"nowrap"}}>
            <thead><tr><th>Property Name</th><th>City</th><th>POC</th><th>Status</th><th>Live Date</th><th>Agreement</th><th>Term Period</th><th>Lock-in End</th><th>Termination Penalty</th><th>Revenue (All-time)</th><th>Nights Sold</th></tr></thead>
            <tbody>
              {properties.length===0 ? <tr><td colSpan={11} style={{textAlign:"center",color:"#9ca3af",padding:"3rem"}}>No properties found</td></tr> :
              properties.map((p)=>{
                const rev=revenueMap[p.id]||{};
                const agr=agreementMap[p.id]||{};
                const cs=(agr.contractStatus||p.contractStatus||"");
                return <tr key={p.id}>
                  <td style={{fontWeight:500,color:"#1E1E1E",maxWidth:"200px",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</td>
                  <td style={{color:"#4b5563"}}>{p.city||"—"}</td>
                  <td style={{color:"#374151"}}>{p.poc||"—"}</td>
                  <td><StatusChip status={p.status}/></td>
                  <td style={{color:"#4b5563"}}>{p.liveDate||"—"}</td>
                  <td><span style={{fontSize:"0.75rem",fontWeight:500,color:cs.toLowerCase()==="signed"?"#15803d":"#b45309"}}>{cs||"—"}</span></td>
                  <td style={{color:"#4b5563",fontSize:"0.75rem"}}>{agr.agreementTermPeriod||"—"}</td>
                  <td style={{color:"#4b5563",fontSize:"0.75rem"}}>{agr.lockInPeriod||p.lockIn||"—"}</td>
                  <td style={{color:"#374151",fontSize:"0.75rem"}}>{agr.terminationPenalty?`₹${Number(agr.terminationPenalty.replace(/[^0-9.]/g,"")).toLocaleString("en-IN")}`:"—"}</td>
                  <td style={{fontWeight:500,color:"#15803d"}}>{rev.totalRevenue?`₹${Number(rev.totalRevenue).toLocaleString("en-IN",{maximumFractionDigits:0})}`:"—"}</td>
                  <td style={{color:"#374151"}}>{rev.totalNights??"—"}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
