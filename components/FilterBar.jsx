"use client";
import { useState, useRef, useEffect } from "react";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export default function FilterBar({ pocs, filters, onChange }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const filtered = pocs.filter(p => p.toLowerCase().includes(search.toLowerCase()));
  const selectedLabel = filters.poc === "all" ? "All POCs" : filters.poc;
  return (
    <div style={{background:"white",borderBottom:"1px solid #e5e7eb",position:"sticky",top:0,zIndex:30,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      <div style={{maxWidth:"1600px",margin:"0 auto",padding:"1rem 1.5rem",display:"flex",flexWrap:"wrap",alignItems:"center",gap:"1rem"}}>
        <div style={{marginRight:"1rem",display:"none"}}>
          <span style={{fontFamily:"Georgia,serif",fontSize:"1.1rem",color:"#1E1E1E",fontWeight:600}}>StayVista</span>
          <span style={{marginLeft:"0.5rem",fontSize:"0.7rem",color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.1em"}}>Acquisition</span>
        </div>
        <div className="hidden md:block" style={{marginRight:"1rem"}}>
          <span style={{fontFamily:"Georgia,serif",fontSize:"1.1rem",color:"#1E1E1E",fontWeight:600}}>StayVista</span>
          <span style={{marginLeft:"0.5rem",fontSize:"0.7rem",color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.1em"}}>Acquisition</span>
        </div>
        {/* POC Searchable Dropdown */}
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
          <label style={{fontSize:"0.7rem",fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em"}}>POC</label>
          <div ref={ref} style={{position:"relative",minWidth:"200px"}}>
            <button onClick={()=>setOpen(!open)}
              style={{width:"100%",fontSize:"0.875rem",border:"1px solid #e5e7eb",borderRadius:"0.5rem",padding:"0.5rem 0.75rem",background:"white",textAlign:"left",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"0.5rem"}}>
              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selectedLabel}</span>
              <span style={{fontSize:"0.6rem",color:"#9ca3af"}}>▼</span>
            </button>
            {open && (
              <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"white",border:"1px solid #e5e7eb",borderRadius:"0.5rem",boxShadow:"0 8px 24px rgba(0,0,0,0.12)",zIndex:100,maxHeight:"280px",display:"flex",flexDirection:"column"}}>
                <div style={{padding:"0.5rem"}}>
                  <input autoFocus type="text" placeholder="Search POC..." value={search} onChange={e=>setSearch(e.target.value)}
                    style={{width:"100%",fontSize:"0.875rem",border:"1px solid #e5e7eb",borderRadius:"0.375rem",padding:"0.4rem 0.6rem",outline:"none",boxSizing:"border-box"}}/>
                </div>
                <div style={{overflowY:"auto",maxHeight:"220px"}}>
                  <div onClick={()=>{onChange({...filters,poc:"all"});setOpen(false);setSearch("");}}
                    style={{padding:"0.5rem 0.75rem",cursor:"pointer",fontSize:"0.875rem",background:filters.poc==="all"?"#f0f9ff":"white",fontWeight:filters.poc==="all"?600:400}}
                    onMouseEnter={e=>e.target.style.background="#f9fafb"}
                    onMouseLeave={e=>e.target.style.background=filters.poc==="all"?"#f0f9ff":"white"}>
                    All POCs
                  </div>
                  {filtered.map(p=>(
                    <div key={p} onClick={()=>{onChange({...filters,poc:p});setOpen(false);setSearch("");}}
                      style={{padding:"0.5rem 0.75rem",cursor:"pointer",fontSize:"0.875rem",background:filters.poc===p?"#f0f9ff":"white",fontWeight:filters.poc===p?600:400}}
                      onMouseEnter={e=>e.target.style.background="#f9fafb"}
                      onMouseLeave={e=>e.target.style.background=filters.poc===p?"#f0f9ff":"white"}>
                      {p}
                    </div>
                  ))}
                  {filtered.length===0 && <div style={{padding:"0.75rem",fontSize:"0.875rem",color:"#9ca3af",textAlign:"center"}}>No POCs found</div>}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Month */}
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
          <label style={{fontSize:"0.7rem",fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em"}}>Month</label>
          <select value={filters.month} onChange={(e)=>onChange({...filters,month:parseInt(e.target.value)})}
            style={{fontSize:"0.875rem",border:"1px solid #e5e7eb",borderRadius:"0.5rem",padding:"0.5rem 0.75rem",background:"white"}}>
            {MONTHS.map((m,i)=><option key={m} value={i+1}>{m}</option>)}
          </select>
        </div>
        {/* Year */}
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
          <label style={{fontSize:"0.7rem",fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em"}}>Year</label>
          <select value={filters.year} onChange={(e)=>onChange({...filters,year:parseInt(e.target.value)})}
            style={{fontSize:"0.875rem",border:"1px solid #e5e7eb",borderRadius:"0.5rem",padding:"0.5rem 0.75rem",background:"white"}}>
            {years.map((y)=><option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div style={{marginLeft:"auto",fontSize:"0.75rem",color:"#9ca3af"}}>
          {MONTHS[filters.month-1]} {filters.year}
          {filters.poc!=="all" && <span style={{marginLeft:"0.5rem",background:"#e0f2fe",color:"#1E1E1E",padding:"0.15rem 0.5rem",borderRadius:"9999px"}}>{filters.poc}</span>}
        </div>
      </div>
    </div>
  );
}
