const checklist = [
  { number: "01", title: "Invoice", detail: "Upload an Excel workbook (.xlsx)", status: "Required" },
  { number: "02", title: "Purchase order", detail: "Upload the matching PO workbook (.xlsx)", status: "Required" },
  { number: "03", title: "Contract", detail: "Upload a Word document (.docx), if applicable", status: "Optional" },
];

export default function Home() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="Naxa home"><span className="brand-mark">N</span><span>NAXA<span className="brand-sub">COMPLIANCE</span></span></a>
        <div className="workspace-label">WORKSPACE</div>
        <a className="nav-item active" href="#home"><span>▦</span> Overview</a>
        <a className="nav-item muted" href="#documents"><span>▤</span> Documents <small>SOON</small></a>
        <a className="nav-item muted" href="#reviews"><span>◷</span> Reviews <small>SOON</small></a>
        <div className="sidebar-bottom"><span className="avatar">D</span><span><b>Demo workspace</b><small>Local environment</small></span><span className="dots">•••</span></div>
      </aside>

      <section className="main-area" id="home">
        <header className="topbar"><span>Workspace <span className="slash">/</span> Overview</span><span className="env-pill"><i /> Local demo</span></header>
        <div className="content">
          <div className="eyebrow">INVOICE COMPLIANCE</div>
          <h1>Review documents<br />before payment.</h1>
          <p className="intro">Upload an invoice and its purchase order. Naxa will check that the evidence is present and compare the totals for your review.</p>

          <div className="section-heading"><div><h2>Start a review</h2><p>Use your existing files. No Naxa template required.</p></div><span className="step-tag">STEP 1 OF 3</span></div>
          <div className="upload-card" id="documents">
            <div className="upload-icon">↑</div>
            <div><b>Document upload is coming next</b><p>The upload controls are not connected yet. This page is the first app foundation.</p></div>
            <button type="button" disabled>Choose files</button>
          </div>

          <div className="file-list">
            {checklist.map((item) => <div className="file-row" key={item.number}><span className="file-number">{item.number}</span><div className="file-copy"><b>{item.title}</b><small>{item.detail}</small></div><span className={item.status === "Required" ? "required" : "optional"}>{item.status}</span></div>)}
          </div>
          <p className="file-limit">Supported files: .xlsx and .docx · Maximum 10 MB per file</p>

          <div className="info-banner"><span>i</span><p><b>What happens after upload?</b><br />We’ll show the information found in each file so you can confirm or correct it before any comparison. Missing or unclear evidence will be sent for human review.</p></div>
          <footer>Financial checks will be deterministic. Naxa does not approve or send payments.</footer>
        </div>
      </section>
    </main>
  );
}
