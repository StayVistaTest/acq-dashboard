"use client";
import { useState, useEffect, useCallback } from "react";
import FilterBar from "@/components/FilterBar";
import InputMetrics from "@/components/InputMetrics";
import LiveRoomCount from "@/components/LiveRoomCount";
import PropertyTable from "@/components/PropertyTable";
function Spinner() {
  return <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"6rem 0"}}><div style={{width:"2rem",height:"2rem",border:"2px solid #9CCCFB",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
}
export default function Dashboard() {
  const now = new Date();
  const [filters, setFilters] = useState({poc:"all",month:now.getMonth()+1,year:now.getFullYear()});
  const [pocs, setPocs] = useState([]);
  const [supplyData, setSupplyData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [agreementData, setAgreementData] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/pocs").then((r)=>r.json()),
      fetch("/api/supply-master").then((r)=>r.json()),
      fetch("/api/revenue").then((r)=>r.json()),
      fetch("/api/agreement").then((r)=>r.json()),
    ]).then(([pocsRes,supplyRes,revRes,agrRes])=>{
      if(pocsRes.error) throw new Error(pocsRes.error);
      setPocs(pocsRes.pocs||[]);
      setSupplyData(supplyRes.data||[]);
      setRevenueData(revRes.data||[]);
      setAgreementData(agrRes.data||[]);
      setLoading(false);
    }).catch((err)=>{setError(err.message);setLoading(false);});
  }, []);
  const fetchMetrics = useCallback(() => {
    setMetricsLoading(true);
    fetch(`/api/input-metrics?month=${filters.month}&year=${filters.year}`)
      .then((r)=>r.json()).then((res)=>{setMetricsData(res.data||{});setMetricsLoading(false);})
      .catch(()=>setMetricsLoading(false));
  }, [filters.month, filters.year]);
  useEffect(()=>{fetchMetrics();},[fetchMetrics]);
  if (error) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#FAF7F2"}}>
      <div style={{background:"white",borderRadius:"1rem",padding:"2rem",maxWidth:"28rem",boxShadow:"0 1px 3px rgba(0,0,0,0.1)",border:"1px solid #fee2e2"}}>
        <p style={{color:"#dc2626",fontWeight:500,marginBottom:"0.5rem"}}>Connection Error</p>
        <p style={{fontSize:"0.875rem",color:"#4b5563"}}>{error}</p>
        <p style={{fontSize:"0.75rem",color:"#9ca3af",marginTop:"1rem"}}>Make sure the Google Sheet is shared with the service account and environment variables are set in Vercel.</p>
        <button onClick={()=>window.location.reload()} style={{marginTop:"1rem",fontSize:"0.875rem",background:"#9CCCFB",padding:"0.5rem 1rem",borderRadius:"0.5rem",border:"none",cursor:"pointer"}}>Retry</button>
      </div>
    </div>
  );
  return (
    <div style={{minHeight:"100vh",background:"#FAF7F2"}}>
      <FilterBar pocs={pocs} filters={filters} onChange={setFilters}/>
      <div style={{maxWidth:"1600px",margin:"0 auto",padding:"2rem 1.5rem 1rem"}}>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"1.875rem",color:"#1E1E1E",margin:0}}>Acquisition POC Dashboard</h1>
        <p style={{color:"#9ca3af",fontSize:"0.875rem",marginTop:"0.25rem"}}>Daily performance tracking · {pocs.length} active POCs · {supplyData?.length??"—"} properties</p>
      </div>
      {loading ? <Spinner/> : (
        <div style={{maxWidth:"1600px",margin:"0 auto",padding:"0 1.5rem 4rem",display:"flex",flexDirection:"column",gap:"2.5rem"}}>
          {metricsLoading ? <Spinner/> : <InputMetrics data={metricsData} filters={filters}/>}
          <LiveRoomCount supplyData={supplyData} filters={filters}/>
          <PropertyTable supplyData={supplyData} revenueData={revenueData} agreementData={agreementData} filters={filters}/>
        </div>
      )}
    </div>
  );
}
