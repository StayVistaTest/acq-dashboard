"use client";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export default function FilterBar({ pocs, filters, onChange }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-wrap items-center gap-4">
        <div className="mr-4 hidden md:block">
          <span style={{fontFamily:"Georgia,serif",fontSize:"1.1rem",color:"#1E1E1E",fontWeight:600}}>StayVista</span>
          <span style={{marginLeft:"0.5rem",fontSize:"0.7rem",color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.1em"}}>Acquisition</span>
        </div>
        <div style={{height:"1.5rem",width:"1px",background:"#e5e7eb"}} className="hidden md:block" />
        <div className="flex items-center gap-2">
          <label style={{fontSize:"0.7rem",fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em"}}>POC</label>
          <select value={filters.poc} onChange={(e) => onChange({ ...filters, poc: e.target.value })}
            style={{fontSize:"0.875rem",border:"1px solid #e5e7eb",borderRadius:"0.5rem",padding:"0.5rem 0.75rem",background:"white",minWidth:"180px"}}>
            <option value="all">All POCs</option>
            {pocs.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label style={{fontSize:"0.7rem",fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em"}}>Month</label>
          <select value={filters.month} onChange={(e) => onChange({ ...filters, month: parseInt(e.target.value) })}
            style={{fontSize:"0.875rem",border:"1px solid #e5e7eb",borderRadius:"0.5rem",padding:"0.5rem 0.75rem",background:"white"}}>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label style={{fontSize:"0.7rem",fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em"}}>Year</label>
          <select value={filters.year} onChange={(e) => onChange({ ...filters, year: parseInt(e.target.value) })}
            style={{fontSize:"0.875rem",border:"1px solid #e5e7eb",borderRadius:"0.5rem",padding:"0.5rem 0.75rem",background:"white"}}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div style={{marginLeft:"auto",fontSize:"0.75rem",color:"#9ca3af"}}>
          {MONTHS[filters.month-1]} {filters.year}
          {filters.poc !== "all" && <span style={{marginLeft:"0.5rem",background:"#e0f2fe",color:"#1E1E1E",padding:"0.15rem 0.5rem",borderRadius:"9999px"}}>{filters.poc}</span>}
        </div>
      </div>
    </div>
  );
}
