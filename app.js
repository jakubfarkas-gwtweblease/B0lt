const { useState, useEffect, useMemo, useRef } = React;

const STORAGE_KEY = "delivery-earnings-v1";
const APP_VERSION = "2026-10-09.1";

/* ---------- services · farby z fotky + gradienty (čierny text čitateľný) ---------- */
const SERVICES = {
  bolt:   { key: "bolt",   name: "Bolt",   solid: "#0C2C1D",
            grad: "linear-gradient(135deg, #B6ECD0 0%, #6FCB9F 60%, #3EA877 120%)",
            chip: "#0C2C1D", glow: "rgba(46,150,101,0.45)", soft: "rgba(46,150,101,0.14)" },
  wolt:   { key: "wolt",   name: "Wolt",   solid: "#5BA1CB",
            grad: "linear-gradient(135deg, #C4E4F4 0%, #7FBEE0 60%, #5BA1CB 120%)",
            chip: "#1B4B66", glow: "rgba(91,161,203,0.5)", soft: "rgba(91,161,203,0.16)" },
  bistro: { key: "bistro", name: "Bistro", solid: "#FE8008",
            grad: "linear-gradient(135deg, #FFD3A0 0%, #FFA84D 55%, #FE8008 120%)",
            chip: "#7A3B00", glow: "rgba(254,128,8,0.5)", soft: "rgba(254,128,8,0.16)" },
};
const ORDER = ["bolt", "wolt", "bistro"];
const INK = "#0C0C0C";        // čierne písmená na kartách
const P = {
  bg: "#FFFFFF", ink: "#0C0C0C", dim: "#6B6B6E", faint: "#A6A6AA",
  line: "rgba(0,0,0,0.08)", card: "#FFFFFF", soft: "#F4F4F5",
};
const SANS = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif";
const MONO = "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, monospace";

const EMPTY_IMG = "data:image/jpeg;base64,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";

/* ---------- helpers ---------- */
const pad2 = (n) => String(n).padStart(2, "0");
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const localDate = (iso) => { const d = new Date(iso); return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; };
const todayISO = () => localDate(new Date().toISOString());
const hm = (iso) => { const d = new Date(iso); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
const eur = (n) => `${(Math.round((n + Number.EPSILON) * 100) / 100).toFixed(2)}€`;
const durMin = (a, b) => Math.max(0, Math.round((new Date(b) - new Date(a)) / 60000));
const durText = (m) => m >= 60 ? `${Math.floor(m/60)} h ${m%60} min` : `${m} min`;
const secText = (s) => `${pad2(Math.floor(Math.max(0, s) / 60))}:${pad2(Math.max(0, s) % 60)}`;
const hms = (iso) => { const d = new Date(iso); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`; };
const WAIT_LIMITS = { bistro: 7 * 60, bolt: 15 * 60 };
const waitingSeconds = (start, end) => Math.max(0, Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 1000));
const bistroCompensation = (seconds) => Math.min(200, Math.max(0, Math.floor((seconds - WAIT_LIMITS.bistro) / 60)) * 20) / 100;
const amt = (o) => o.amount + (o.compensation || 0);   // suma vrátane kompenzácie

const mondayOf = (d) => { const x = new Date(d); const day = (x.getDay() + 6) % 7; x.setDate(x.getDate() - day); x.setHours(0,0,0,0); return x; };
const weekLabel = (mondayISO) => {
  const s = new Date(mondayISO + "T00:00:00"); const e = new Date(s); e.setDate(e.getDate() + 6);
  return `${s.getDate()}.${s.getMonth()+1}. – ${e.getDate()}.${e.getMonth()+1}.`;
};
const monthLabel = (ym) => { const [y, mo] = ym.split("-"); const d = new Date(Number(y), Number(mo)-1, 1);
  const n = d.toLocaleDateString("sk-SK", { month: "long" }); return `${n.charAt(0).toUpperCase() + n.slice(1)} ${y}`; };

/* čakanie: od doručenia predošlej po prijatie ďalšej (v minútach) */
const waitingGaps = (orders) => {
  const s = [...orders].sort((a, b) => (a.received < b.received ? -1 : 1));
  const gaps = [];
  for (let i = 1; i < s.length; i++) {
    const prev = s[i-1];
    if (prev.delivered) { const g = Math.round((new Date(s[i].received) - new Date(prev.delivered)) / 60000); if (g >= 0) gaps.push(g); }
  }
  return gaps;
};
const mean = (arr) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;

/* presné vzťahy medzi susednými objednávkami (podľa času prijatia): čakanie ALEBO prekryv */
const orderRelations = (orders) => {
  const s = [...orders].sort((a, b) => (a.received < b.received ? -1 : 1));
  const rel = [];
  for (let i = 1; i < s.length; i++) {
    const prev = s[i - 1], next = s[i];
    if (!prev.delivered) { rel.push({ prevId: prev.id, nextId: next.id, gapMin: null, overlap: true }); continue; }
    const g = Math.round((new Date(next.received) - new Date(prev.delivered)) / 60000);
    rel.push({ prevId: prev.id, nextId: next.id, gapMin: g, overlap: g < 0 });
  }
  return rel;
};

const nedorucWord = (n) => n === 1 ? "nedoručená" : (n >= 2 && n <= 4) ? "nedoručené" : "nedoručených";
const objWord = (n) => n === 1 ? "objednávka" : (n >= 2 && n <= 4) ? "objednávky" : "objednávok";

const dayLabel = (iso) => {
  const t = todayISO();
  const y = localDate(new Date(Date.now() - 864e5).toISOString());
  if (iso === t) return "Dnes";
  if (iso === y) return "Včera";
  const d = new Date(iso + "T00:00:00");
  const wd = d.toLocaleDateString("sk-SK", { weekday: "long" });
  return `${wd.charAt(0).toUpperCase() + wd.slice(1)} ${d.getDate()}.${d.getMonth()+1}.`;
};

/* ---------- storage ---------- */
const loadData = () => {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) { const d = JSON.parse(r); if (d && Array.isArray(d.orders)) return { orders: d.orders, tips: d.tips || {} }; } } catch (e) {}
  return { orders: [], tips: {} };
};
const saveData = (d) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); return true; } catch (e) { return false; } };

/* ---------- icons ---------- */
const Icon = ({ name, size = 20, stroke = 2, fill = false }) => {
  const c = { width: size, height: size, viewBox: "0 0 24 24", fill: fill ? "currentColor" : "none", stroke: fill ? "none" : "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const P2 = {
    bolt: <path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z" fill="currentColor" stroke="none" />,
    bag: <React.Fragment><path d="M6 8h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.4H8.5A1.5 1.5 0 0 1 7 20.5z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></React.Fragment>,
    utensils: <React.Fragment><path d="M8 2v9M5.5 2v5a2.5 2.5 0 0 0 5 0V2M8 11v11" /><path d="M17 2c-1.6 0-3 2.2-3 5s1 4 2 4v11" /></React.Fragment>,
    check: <path d="M5 13l4 4L19 7" />,
    check2: <path d="M4 12l5 5L20 6" />,
    clock: <React.Fragment><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></React.Fragment>,
    share: <React.Fragment><path d="M12 15V3" /><path d="M8 7l4-4 4 4" /><path d="M5 12v6.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V12" /></React.Fragment>,
    trash: <React.Fragment><path d="M4 7h16" /><path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" /><path d="M6 7l1 13a1.5 1.5 0 0 0 1.5 1.4h7a1.5 1.5 0 0 0 1.5-1.4L18 7" /></React.Fragment>,
    plus: <React.Fragment><path d="M12 5v14M5 12h14" /></React.Fragment>,
    back: <path d="M9 14l-4-4 4-4M5 10h10a5 5 0 0 1 0 10h-1" />,
    x: <path d="M6 6l12 12M18 6L6 18" />,
    download: <React.Fragment><path d="M12 3v12" /><path d="M8 11l4 4 4-4" /><path d="M5 20h14" /></React.Fragment>,
    upload: <React.Fragment><path d="M12 15V3" /><path d="M8 7l4-4 4 4" /><path d="M5 20h14" /></React.Fragment>,
    chart: <React.Fragment><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></React.Fragment>,
    calendar: <React.Fragment><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4" /></React.Fragment>,
    coins: <React.Fragment><ellipse cx="9" cy="7" rx="6" ry="3" /><path d="M3 7v5c0 1.66 2.7 3 6 3s6-1.34 6-3" /><path d="M9 12v5c0 1.66 2.7 3 6 3s6-1.34 6-3v-5" /><ellipse cx="15" cy="12" rx="6" ry="3" /></React.Fragment>,
    timer: <React.Fragment><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2.5M9 2h6" /></React.Fragment>,
    hash: <path d="M9 3L7 21M17 3l-2 18M4 8.5h16M3 15.5h16" />,
    star: <path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.9 6.7 19.4l1.2-6L3.4 9.3l6-.7z" />,
    trophy: <React.Fragment><path d="M7 4h10v4a5 5 0 0 1-10 0z" /><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" /><path d="M12 13v4M8.5 20.5h7M10 17.5h4" /></React.Fragment>,
    delivered: <React.Fragment><circle cx="12" cy="12" r="8.5" /><path d="M8.5 12l2.4 2.4L15.5 9.5" /></React.Fragment>,
    chevrondown: <path d="M5 9l7 7 7-7" />,
    chevronup: <path d="M5 15l7-7 7 7" />,
    warn: <React.Fragment><path d="M12 3.2 2.2 20.5h19.6z" /><path d="M12 9.5v4.3M12 17.2h.01" /></React.Fragment>,
  };
  return <svg {...c} style={{ display: "block" }}>{P2[name] || null}</svg>;
};
const svcIcon = { bolt: "bolt", wolt: "bag", bistro: "utensils" };

/* ---------- toast ---------- */
const useToast = () => {
  const [msg, setMsg] = useState("");
  const show = (m) => { setMsg(m); clearTimeout(show._t); show._t = setTimeout(() => setMsg(""), 1900); };
  return [msg, show];
};

/* ---------- share ---------- */
const shareText = async (text, toast) => {
  const data = { text };
  // 1) natívny iOS/Android share sheet (funguje na nasadenej HTTPS appke)
  try {
    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      await navigator.share(data);
      return;
    }
  } catch (e) {
    if (e && e.name === "AbortError") return; // používateľ zrušil — nič ďalej
  }
  // 2) fallback: schránka (moderné API)
  try { await navigator.clipboard.writeText(text); toast("Skopírované ✓"); return; }
  catch (e) {}
  // 3) posledná záchrana: dočasné textarea + execCommand
  try {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.top = "0"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    const okc = document.execCommand("copy");
    document.body.removeChild(ta);
    toast(okc ? "Skopírované ✓" : "Nedá sa zdieľať");
  } catch (e) { toast("Nedá sa zdieľať"); }
};

/* ---------- keypad sheet ---------- */
const Keypad = ({ config, onConfirm, onCancel, onClear }) => {
  const [str, setStr] = useState(config.initial || "");
  const [dbl, setDbl] = useState(false);
  const s = config.service ? SERVICES[config.service] : null;
  const grad = s ? s.grad : "linear-gradient(135deg, #2A2A2E 0%, #111 130%)";
  const glow = s ? s.glow : "rgba(0,0,0,0.35)";
  const ink = s ? INK : "#fff";
  const press = (k) => {
    setStr((cur) => {
      if (k === "back") return cur.slice(0, -1);
      if (k === ".") { if (cur.includes(".")) return cur; return cur === "" ? "0." : cur + "."; }
      if (cur.includes(".")) { const dec = cur.split(".")[1]; if (dec.length >= 2) return cur; }
      if (cur === "0") return k;
      return cur + k;
    });
  };
  const val = parseFloat(str);
  const ok = !isNaN(val) && val > 0;
  const disp = str === "" ? "0" : str;
  const keys = ["1","2","3","4","5","6","7","8","9",".","0","back"];
  return (
    <div className="overlay-in" style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="sheet" style={{ background: "#FFFFFF", borderRadius: "26px 26px 0 0", padding: "10px 16px calc(16px + env(safe-area-inset-bottom))", boxShadow: "0 -12px 40px rgba(0,0,0,0.25)" }}>
        <div style={{ width: 40, height: 5, borderRadius: 3, background: "rgba(0,0,0,0.14)", margin: "4px auto 14px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: grad, display: "flex", alignItems: "center", justifyContent: "center", color: ink, boxShadow: `0 6px 16px ${glow}` }}>
            <Icon name={config.icon || (s ? svcIcon[config.service] : "coins")} size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: P.dim, fontFamily: SANS, fontWeight: 600 }}>{config.subtitle}</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: INK, fontFamily: SANS }}>{config.title}</div>
          </div>
          <button onClick={onCancel} className="press" style={{ width: 36, height: 36, borderRadius: "50%", background: P.soft, color: P.dim, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="x" size={18} /></button>
        </div>
        <div style={{ textAlign: "center", padding: "14px 0 18px" }}>
          <span style={{ fontSize: 52, fontWeight: 800, fontFamily: MONO, color: ok || str ? INK : P.faint, letterSpacing: "-0.02em" }}>{disp}</span>
          <span style={{ fontSize: 34, fontWeight: 700, fontFamily: MONO, color: P.dim, marginLeft: 4 }}>€</span>
        </div>
        {config.kind === "order" && (
          <button onClick={() => setDbl((v) => !v)} className="press" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            margin: "0 auto 14px", padding: "9px 16px", borderRadius: 999, background: dbl ? "#111" : P.soft, color: dbl ? "#fff" : P.dim,
            fontSize: 13, fontWeight: 700, fontFamily: SANS, width: "fit-content" }}>
            {dbl && <Icon name="check" size={14} stroke={3} />} Dvojitá objednávka
          </button>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9 }}>
          {keys.map((k) => (
            <button key={k} onClick={() => press(k)} className="press"
              style={{ height: 60, borderRadius: 16, background: k === "back" ? P.soft : "#F7F7F8", fontSize: 24, fontWeight: 700, fontFamily: MONO, color: INK, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {k === "back" ? <Icon name="back" size={22} /> : k}
            </button>
          ))}
        </div>
        <button onClick={() => ok && onConfirm(val, dbl)} disabled={!ok} className="press"
          style={{ width: "100%", marginTop: 12, height: 62, borderRadius: 18, background: ok ? grad : P.soft, color: ok ? ink : P.faint,
            fontSize: 18, fontWeight: 800, fontFamily: SANS, display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
            boxShadow: ok ? `0 8px 22px ${glow}` : "none", opacity: ok ? 1 : 0.7 }}>
          <Icon name="check" size={24} stroke={2.6} /> {config.verb || "Zapísať"} {ok ? eur(val) : ""}
        </button>
        {onClear && (
          <button onClick={onClear} className="press" style={{ width: "100%", marginTop: 8, height: 46, borderRadius: 14, background: "#FBECEC", color: "#E5484D", fontSize: 14, fontWeight: 700, fontFamily: SANS, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <Icon name="trash" size={16} /> Vymazať
          </button>
        )}
      </div>
    </div>
  );
};

/* ---------- generic picker sheet (week/month) ---------- */
const PickerSheet = ({ title, options, selected, onPick, onCancel }) => (
  <div className="overlay-in" style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
    onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
    <div className="sheet" style={{ background: "#FFFFFF", borderRadius: "26px 26px 0 0", padding: "10px 12px calc(16px + env(safe-area-inset-bottom))", boxShadow: "0 -12px 40px rgba(0,0,0,0.25)", maxHeight: "70vh", display: "flex", flexDirection: "column" }}>
      <div style={{ width: 40, height: 5, borderRadius: 3, background: "rgba(0,0,0,0.14)", margin: "4px auto 12px" }} />
      <div style={{ fontSize: 17, fontWeight: 800, color: INK, fontFamily: SANS, padding: "0 8px 12px" }}>{title}</div>
      <div style={{ overflowY: "auto" }}>
        {options.map((o) => {
          const on = o.key === selected;
          return (
            <button key={o.key} onClick={() => onPick(o.key)} className="press"
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 14px", borderRadius: 14, marginBottom: 4,
                background: on ? "#111" : "#F7F7F8", color: on ? "#fff" : INK }}>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span style={{ fontSize: 15, fontWeight: 700, fontFamily: SANS }}>{o.label}</span>
                {o.sub && <span style={{ fontSize: 12, fontFamily: MONO, color: on ? "rgba(255,255,255,0.7)" : P.dim, marginTop: 2 }}>{o.sub}</span>}
              </span>
              {on && <Icon name="check" size={18} stroke={2.6} />}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

/* ---------- live wait timers · per order, persisted as timestamps ---------- */
const WaitTracker = ({ o, onStart, onEnd, onResolve, onCustom }) => {
  const [now, setNow] = useState(() => Date.now());
  const wait = o.wait;
  const active = !!(wait && wait.startedAt && !wait.endedAt);
  useEffect(() => {
    if (!active) return;
    // Every tick uses the real clock, never a counter that drifts in iOS background.
    const refresh = () => setNow(Date.now());
    refresh();
    const timer = setInterval(refresh, 250);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("pageshow", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [active, wait && wait.startedAt]);
  if (!(o.service in WAIT_LIMITS)) return null;
  const s = SERVICES[o.service];
  const limit = WAIT_LIMITS[o.service];
  const panel = { marginTop: 12, borderRadius: 15, padding: "12px 13px", border: "1px solid rgba(0,0,0,0.09)", background: "rgba(255,255,255,0.34)", color: INK, fontFamily: SANS };
  const small = { fontSize: 11.5, fontWeight: 700, color: "rgba(0,0,0,0.65)", fontFamily: SANS };
  const action = { borderRadius: 12, minHeight: 40, padding: "9px 12px", fontSize: 12.5, fontWeight: 800, fontFamily: SANS };
  if (!wait || !wait.startedAt) {
    if (o.delivered) return null;
    return (
      <button onClick={() => onStart(o.id)} className="press" style={{ ...panel, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, fontWeight: 800, fontSize: 13 }}>
        <Icon name="timer" size={17} /> Som pred reštauráciou · {Math.round(limit / 60)} min
      </button>
    );
  }
  const elapsed = waitingSeconds(wait.startedAt, wait.endedAt || now);
  const remaining = Math.max(0, limit - elapsed);
  const overtime = Math.max(0, elapsed - limit);
  const ready = elapsed >= limit;
  const estimate = o.service === "bistro" ? bistroCompensation(elapsed) : 0;
  const done = !!wait.endedAt;
  const resolved = !!wait.resolution;
  return (
    <div style={panel} aria-label={`${s.name} časovač čakania`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <span style={small}>{done ? "Čakanie ukončené" : ready ? (o.service === "bistro" ? "Čakanie na kompenzáciu" : "15 minút uplynulo") : "Zostáva do kompenzácie"}</span>
        <span style={{ ...small, fontFamily: MONO, fontSize: 10.5 }}>príchod {hms(wait.startedAt)}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", justifyContent: "space-between", gap: 8, marginTop: 5 }}>
        <span role="timer" aria-live="off" style={{ fontSize: 37, fontWeight: 900, fontFamily: MONO, color: "#111", letterSpacing: "-0.045em", fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>
          {done ? secText(elapsed) : ready ? `+${secText(overtime)}` : secText(remaining)}
        </span>
        {o.service === "bistro" && ready && (
          <span style={{ fontSize: 24, fontFamily: MONO, fontWeight: 900, color: "#583000" }}>+{eur(estimate)}</span>
        )}
      </div>
      {done ? (
        <div style={{ ...small, marginTop: 5 }}>Odchod {hms(wait.endedAt)} · čakanie {secText(elapsed)}</div>
      ) : ready ? (
        <div style={{ ...small, marginTop: 5, color: "#2C4836" }}>
          {o.service === "bistro" ? (estimate >= 2 ? "Maximálna kompenzácia 2,00 € dosiahnutá" : "Každá celá minúta navyše = 0,20 € · max. 2 €") : "Podľa 15-minútového pravidla: máš nárok na kompenzáciu"}
        </div>
      ) : (
        <div style={{ ...small, marginTop: 5 }}>Odpočet po sekundách · {o.service === "bistro" ? "po 7 minútach sa spustí výpočet 0,20 €/min" : "po 15 minútach sa zobrazí upozornenie"}</div>
      )}
      {!done ? (
        <button onClick={() => onEnd(o.id)} className="press" style={{ ...action, background: "#111", color: "#fff", marginTop: 11, width: "100%" }}>
          Odchod z reštaurácie
        </button>
      ) : !resolved ? (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 12.5, fontWeight: 750, color: INK }}>
            {o.service === "bistro" ? `Vypočítaná kompenzácia: ${eur(estimate)}. Pridať k objednávke?` : ready ? "Časový limit splnený. Ak ti priznali kompenzáciu, zapíš jej sumu." : "Čakanie bolo kratšie než 15 minút. Chceš zapísať vlastnú sumu?"}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {o.service === "bistro" && estimate > 0 && (
              <button className="press" onClick={() => onResolve(o.id, "accepted", estimate)} style={{ ...action, background: "#111", color: "#fff", flex: "1 1 100px" }}>Pridať {eur(estimate)}</button>
            )}
            <button className="press" onClick={() => onCustom(o)} style={{ ...action, background: "rgba(255,255,255,0.68)", color: INK, flex: "1 1 95px" }}>Vlastná suma</button>
            <button className="press" onClick={() => onResolve(o.id, "skipped", null)} style={{ ...action, background: "rgba(255,255,255,0.35)", color: INK, flex: "1 1 78px" }}>Nepridať</button>
          </div>
        </div>
      ) : (
        <div style={{ ...small, marginTop: 9 }}>
          {wait.resolution === "skipped" ? ((o.compensation || 0) > 0 ? `Pôvodná kompenzácia zostáva: ${eur(o.compensation)}` : "Bez pridanej kompenzácie") : `Kompenzácia uložená: ${eur(o.compensation || 0)}`}
        </div>
      )}
    </div>
  );
};

/* ---------- order card ---------- */
const OrderCard = ({ o, i, overlap, onDeliver, onUndeliver, onDelete, onShare, onComp, onToggleDouble, onWaitStart, onWaitEnd, onWaitResolve, onWaitCustom }) => {
  const s = SERVICES[o.service];
  const [confirmDel, setConfirmDel] = useState(false);
  const delivered = !!o.delivered;
  const dmin = delivered ? durMin(o.received, o.delivered) : null;
  const comp = o.compensation || 0;
  const canComp = delivered;
  useEffect(() => { if (!confirmDel) return; const t = setTimeout(() => setConfirmDel(false), 2600); return () => clearTimeout(t); }, [confirmDel]);
  return (
    <div className="card-in lift" style={{ "--i": i, position: "relative", borderRadius: 20, marginBottom: 10, overflow: "hidden",
      background: s.grad, boxShadow: `0 8px 22px ${s.glow}, inset 0 1px 0 rgba(255,255,255,0.4)` }}>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 11, background: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: INK, flexShrink: 0 }}>
            <Icon name={svcIcon[o.service]} size={20} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: INK, fontFamily: SANS, lineHeight: 1.1 }}>{s.name}</div>
            <div style={{ fontSize: 12, color: "rgba(0,0,0,0.62)", fontFamily: MONO, marginTop: 1 }}>
              prijaté {hm(o.received)}{delivered ? ` · doručené ${hm(o.delivered)}` : ""}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: INK, fontFamily: MONO, letterSpacing: "-0.02em" }}>{eur(amt(o))}{o.double && <span style={{ fontSize: 13, marginLeft: 4 }}>2×</span>}</div>
            {comp > 0 && <div style={{ fontSize: 11, color: "rgba(0,0,0,0.6)", fontFamily: MONO, marginTop: 1 }}>{eur(o.amount)} + komp {eur(comp)}</div>}
          </div>
        </div>

        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
          {delivered ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: INK, background: "rgba(255,255,255,0.4)", padding: "5px 10px", borderRadius: 999, fontFamily: SANS }}>
              <Icon name="delivered" size={14} /> doručené · {durText(dmin)}
            </span>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: INK, background: "rgba(255,255,255,0.28)", padding: "5px 10px", borderRadius: 999, fontFamily: SANS }}>
              <Icon name="clock" size={13} /> zatiaľ nedoručené
            </span>
          )}
          {canComp && (
            <button onClick={() => onComp(o)} className="press" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: INK, background: "rgba(255,255,255,0.5)", padding: "5px 11px", borderRadius: 999, fontFamily: SANS }}>
              <Icon name={comp > 0 ? "coins" : "plus"} size={13} /> {comp > 0 ? "upraviť kompenzáciu" : "kompenzácia"}
            </button>
          )}
          <button onClick={() => onToggleDouble(o.id)} className="press" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 800, color: o.double ? "#fff" : INK, background: o.double ? "#111" : "rgba(255,255,255,0.32)", padding: "5px 11px", borderRadius: 999, fontFamily: SANS }}>
            2× {o.double ? "dvojitá" : "označiť dvojitú"}
          </button>
          {overlap && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 800, color: "#B3261E", background: "rgba(229,72,77,0.18)", padding: "5px 11px", borderRadius: 999, fontFamily: SANS }}>
              <Icon name="warn" size={13} /> prekryv
            </span>
          )}
        </div>

        <WaitTracker o={o} onStart={onWaitStart} onEnd={onWaitEnd} onResolve={onWaitResolve} onCustom={onWaitCustom} />

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          {delivered ? (
            <button onClick={() => onUndeliver(o.id)} className="press" style={{ flex: 1, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.32)", color: INK, fontSize: 13, fontWeight: 700, fontFamily: SANS, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Icon name="back" size={16} /> Vrátiť
            </button>
          ) : (
            <button onClick={() => onDeliver(o.id)} className="press" style={{ flex: 1, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.62)", color: INK, fontSize: 13, fontWeight: 800, fontFamily: SANS, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)" }}>
              <Icon name="check2" size={17} stroke={2.5} /> Doručené
            </button>
          )}
          <button onClick={() => onShare(o)} className="press" aria-label="Zdieľať" style={{ width: 44, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.32)", color: INK, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="share" size={17} />
          </button>
          <button onClick={() => { if (confirmDel) onDelete(o.id); else setConfirmDel(true); }} className="press" aria-label="Zmazať"
            style={{ width: confirmDel ? 96 : 44, height: 40, borderRadius: 12, background: confirmDel ? "#E5484D" : "rgba(255,255,255,0.32)", color: confirmDel ? "#fff" : INK, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12.5, fontWeight: 800, fontFamily: SANS, transition: "width 200ms ease, background 200ms ease" }}>
            <Icon name="trash" size={16} /> {confirmDel ? "Naozaj?" : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- gap / overlap divider between cards ---------- */
const GapDivider = ({ rel }) => {
  if (rel.overlap) {
    return (
      <div className="rise" style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 4px 10px", padding: "9px 13px",
        background: "rgba(229,72,77,0.08)", border: "1px dashed rgba(229,72,77,0.4)", borderRadius: 13 }}>
        <span style={{ color: "#E5484D", display: "flex", flexShrink: 0 }}><Icon name="warn" size={15} /></span>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#B3261E", fontFamily: SANS }}>Prekrývajúce sa objednávky</span>
      </div>
    );
  }
  if (rel.gapMin == null) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, margin: "0 4px 10px", fontSize: 11.5, color: P.faint, fontFamily: MONO }}>
      <span style={{ flex: 1, height: 1, background: P.line }} />
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}><Icon name="timer" size={12} /> čakanie {durText(rel.gapMin)}</span>
      <span style={{ flex: 1, height: 1, background: P.line }} />
    </div>
  );
};

/* ---------- day section ---------- */
const DaySection = ({ iso, orders, tips, i, onTip, ...handlers }) => {
  const total = orders.reduce((a, o) => a + amt(o), 0);
  const delivered = orders.filter((o) => o.delivered);
  const deliveredSum = delivered.reduce((a, o) => a + amt(o), 0);
  const first = orders.map((o) => o.received).sort()[0];
  const deliveredTimesSorted = delivered.map((o) => o.delivered).sort();
  const last = deliveredTimesSorted.length ? deliveredTimesSorted[deliveredTimesSorted.length - 1] : null;
  const byS = ORDER.map((k) => { const l = orders.filter((o) => o.service === k); return { k, n: l.length, sum: l.reduce((a, o) => a + amt(o), 0) }; }).filter((x) => x.n > 0);
  const gaps = waitingGaps(orders);
  const avgWait = mean(gaps);
  const dayTip = tips[iso] || 0;
  const relations = orderRelations(orders);
  const relByNextId = {}; relations.forEach((r) => { relByNextId[r.nextId] = r; });
  const overlapIds = new Set(); relations.forEach((r) => { if (r.overlap) { overlapIds.add(r.prevId); overlapIds.add(r.nextId); } });
  const sortedDesc = orders.slice().sort((a, b) => (a.received < b.received ? 1 : -1));
  return (
    <div className="rise" style={{ "--i": i, marginBottom: 22 }}>
      {/* day header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 4px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="calendar" size={15} />
          <span style={{ fontSize: 15, fontWeight: 800, color: P.ink, fontFamily: SANS }}>{dayLabel(iso)}</span>
        </div>
        <span style={{ fontSize: 18, fontWeight: 900, color: P.ink, fontFamily: MONO }}>{eur(total)}</span>
      </div>
      {/* day stats strip */}
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", padding: "0 4px 10px", fontSize: 11.5, color: P.dim, fontFamily: MONO }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="hash" size={12} />{orders.length} {objWord(orders.length)}</span>
        <span>·</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="delivered" size={12} />{eur(deliveredSum)} doručené</span>
        {first && last && (<><span>·</span><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="clock" size={12} />{hm(first)}–{hm(last)}</span></>)}
        {avgWait !== null && (<><span>·</span><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="timer" size={12} />čakanie ~{durText(avgWait)}</span></>)}
      </div>
      {/* by-service mini chips + tip */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "0 4px 12px", alignItems: "center" }}>
        {byS.map((x) => (
          <span key={x.k} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: INK, background: SERVICES[x.k].soft, border: `1px solid ${SERVICES[x.k].solid}22`, padding: "4px 9px", borderRadius: 999, fontFamily: SANS }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: SERVICES[x.k].solid }} />
            {SERVICES[x.k].name} {x.n}× · {eur(x.sum)}
          </span>
        ))}
        <button onClick={() => onTip(iso)} className="press" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: "#8A6D00", background: "rgba(255,196,0,0.14)", border: "1px solid rgba(255,196,0,0.35)", padding: "4px 10px", borderRadius: 999, fontFamily: SANS }}>
          <Icon name={dayTip > 0 ? "coins" : "plus"} size={12} /> {dayTip > 0 ? `prepitné ${eur(dayTip)}` : "prepitné"}
        </button>
      </div>
      {/* orders */}
      {sortedDesc.map((o, k) => (
        <React.Fragment key={o.id}>
          <OrderCard o={o} i={k} overlap={overlapIds.has(o.id)} {...handlers} />
          {k < sortedDesc.length - 1 && relByNextId[o.id] && <GapDivider rel={relByNextId[o.id]} />}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ---------- stats block (week/month/all) ---------- */
const StatRow = ({ label, value, icon, i }) => (
  <div className="rise" style={{ "--i": i, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: `1px solid ${P.line}` }}>
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 13.5, color: P.dim, fontFamily: SANS }}>
      <span style={{ color: P.faint }}><Icon name={icon} size={16} /></span>{label}
    </span>
    <span style={{ fontSize: 15, fontWeight: 800, color: P.ink, fontFamily: MONO }}>{value}</span>
  </div>
);

const StatsBlock = ({ orders, tips }) => {
  const stats = useMemo(() => {
    const total = orders.reduce((a, o) => a + amt(o), 0);
    const delivered = orders.filter((o) => o.delivered);
    const days = new Set(orders.map((o) => localDate(o.received)));
    const nDays = days.size || 1;
    const durs = delivered.map((o) => durMin(o.received, o.delivered));
    const avgDur = mean(durs);
    // waiting across days (per-day gaps, then averaged)
    let allGaps = [];
    days.forEach((d) => { allGaps = allGaps.concat(waitingGaps(orders.filter((o) => localDate(o.received) === d))); });
    const avgWait = mean(allGaps);
    const byDay = {};
    orders.forEach((o) => { const d = localDate(o.received); byDay[d] = (byDay[d] || 0) + amt(o); });
    let bestDay = null, bestSum = 0;
    Object.entries(byDay).forEach(([d, s]) => { if (s > bestSum) { bestSum = s; bestDay = d; } });
    const byS = ORDER.map((k) => { const l = orders.filter((o) => o.service === k); return { k, n: l.length, sum: l.reduce((a, o) => a + amt(o), 0) }; });
    // tips within range (by day membership)
    const tipsSum = [...days].reduce((a, d) => a + (tips[d] || 0), 0);
    return { total, count: orders.length, deliveredN: delivered.length, nDays,
      avgOrder: orders.length ? total / orders.length : 0, avgDay: total / nDays,
      avgDur, avgWait, bestDay, bestSum, byS, maxS: Math.max(1, ...byS.map((x) => x.sum)), tipsSum };
  }, [orders, tips]);

  if (orders.length === 0) return (
    <div style={{ background: P.soft, borderRadius: 18, padding: "40px 20px", textAlign: "center", color: P.faint, fontSize: 14, fontFamily: SANS, marginBottom: 20 }}>
      Zatiaľ žiadne zárobky v tomto období.
    </div>
  );

  return (
    <div style={{ marginBottom: 20 }}>
      <div className="rise" style={{ background: "linear-gradient(135deg, #111 0%, #2A2A2E 130%)", borderRadius: 20, padding: "18px 18px", marginBottom: 12, color: "#fff", boxShadow: "0 10px 26px rgba(0,0,0,0.22)" }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.6)", fontFamily: SANS }}>Spolu za obdobie</div>
        <div style={{ fontSize: 38, fontWeight: 900, fontFamily: MONO, letterSpacing: "-0.02em", marginTop: 4 }}>{eur(stats.total)}</div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", fontFamily: MONO, marginTop: 3 }}>
          {stats.count} {objWord(stats.count)} · {stats.nDays} {stats.nDays === 1 ? "deň" : (stats.nDays >= 2 && stats.nDays <= 4) ? "dni" : "dní"}
        </div>
        {stats.tipsSum > 0 && (
          <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, fontFamily: SANS, background: "rgba(255,196,0,0.18)", color: "#FFD766", padding: "6px 11px", borderRadius: 999 }}>
            <Icon name="coins" size={14} /> prepitné {eur(stats.tipsSum)} · nezarátané
          </div>
        )}
      </div>

      <div className="rise" style={{ "--i": 1, background: P.card, border: `1px solid ${P.line}`, borderRadius: 18, padding: "16px", marginBottom: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: P.faint, fontFamily: SANS, marginBottom: 14 }}>Podľa služby</div>
        {stats.byS.map((x, idx) => (
          <div key={x.k} style={{ marginBottom: idx < 2 ? 13 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontFamily: SANS, marginBottom: 6 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontWeight: 700, color: P.ink }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: SERVICES[x.k].solid }} />{SERVICES[x.k].name}
                <span style={{ color: P.faint, fontWeight: 500 }}>· {x.n}×</span>
              </span>
              <span style={{ fontFamily: MONO, fontWeight: 800, color: P.ink }}>{eur(x.sum)}</span>
            </div>
            <div style={{ height: 9, borderRadius: 999, background: P.soft, overflow: "hidden" }}>
              <div className="bar-grow" style={{ "--i": idx, height: "100%", width: `${(x.sum / stats.maxS) * 100}%`, background: SERVICES[x.k].grad, borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="rise" style={{ "--i": 2, background: P.card, border: `1px solid ${P.line}`, borderRadius: 18, padding: "6px 16px 14px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: P.faint, fontFamily: SANS, margin: "12px 0 4px" }}>Štatistiky</div>
        <StatRow i={0} icon="coins" label="Priemer na objednávku" value={eur(stats.avgOrder)} />
        <StatRow i={1} icon="calendar" label="Priemer na deň" value={eur(stats.avgDay)} />
        <StatRow i={2} icon="delivered" label="Doručené" value={`${stats.deliveredN}/${stats.count}`} />
        {stats.avgDur !== null && <StatRow i={3} icon="timer" label="Priemerné trvanie" value={durText(stats.avgDur)} />}
        {stats.avgWait !== null && <StatRow i={4} icon="clock" label="Priemerné čakanie medzi obj." value={durText(stats.avgWait)} />}
        {stats.bestDay && <StatRow i={5} icon="trophy" label={`Najlepší deň · ${dayLabel(stats.bestDay)}`} value={eur(stats.bestSum)} />}
        {stats.tipsSum > 0 && <StatRow i={6} icon="star" label="Prepitné (nezarátané)" value={eur(stats.tipsSum)} />}
      </div>
    </div>
  );
};

/* ---------- empty state ---------- */
const EmptyHero = () => (
  <div className="fade" style={{ textAlign: "center", paddingTop: 4 }}>
    <div style={{ borderRadius: 26, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.12)", marginBottom: 22, position: "relative" }}>
      <img src={EMPTY_IMG} alt="" style={{ width: "100%", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 55%, rgba(255,255,255,0.9) 100%)" }} />
    </div>
    <div style={{ fontSize: 20, fontWeight: 900, color: P.ink, fontFamily: SANS, letterSpacing: "-0.01em", marginBottom: 7 }}>Tvoja cesta začína</div>
    <div style={{ fontSize: 14.5, color: P.dim, fontFamily: SANS, maxWidth: 300, margin: "0 auto", lineHeight: 1.55 }}>
      Ťukni dole na <b style={{ color: SERVICES.bolt.solid }}>Bolt</b>, <b style={{ color: SERVICES.wolt.solid }}>Wolt</b> alebo <b style={{ color: SERVICES.bistro.solid }}>Bistro</b> a zapíš svoj prvý zárobok.
    </div>
    <div className="bounce" style={{ marginTop: 22, color: P.faint, display: "flex", justifyContent: "center" }}><Icon name="chevrondown" size={28} /></div>
  </div>
);

/* ---------- app ---------- */
const App = () => {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState("day"); // day | week | month | all
  const [keypad, setKeypad] = useState(null); // { kind, service, orderId, date, initial }
  const [picker, setPicker] = useState(null);  // "week" | "month"
  const [weekSel, setWeekSel] = useState(() => localDate(mondayOf(new Date())));
  const [monthSel, setMonthSel] = useState(() => todayISO().slice(0, 7));
  const [toast, showToast] = useToast();
  const [upState, setUpState] = useState("idle");
  const [upLatest, setUpLatest] = useState("");
  const fileRef = useRef(null);

  const persist = (next) => { setData(next); if (!saveData(next)) showToast("Uloženie zlyhalo"); };

  const addOrder = (service, amount, isDouble) => {
    const o = { id: uid(), service, amount, compensation: 0, received: new Date().toISOString(), delivered: null, double: !!isDouble };
    persist({ ...data, orders: [...data.orders, o] });
    setKeypad(null);
    showToast(`${SERVICES[service].name} ${eur(amount)}${isDouble ? " · 2×" : ""} pridané`);
  };
  const toggleDouble = (id) => persist({ ...data, orders: data.orders.map((o) => o.id === id ? { ...o, double: !o.double } : o) });
  const deliver = (id) => {
    const at = new Date().toISOString();
    persist({ ...data, orders: data.orders.map((o) => o.id === id ? {
      ...o, delivered: at,
      // Completing an order also safely stops an active wait timer.
      wait: o.wait && o.wait.startedAt && !o.wait.endedAt ? { ...o.wait, endedAt: at } : o.wait
    } : o) });
  };
  const undeliver = (id) => persist({ ...data, orders: data.orders.map((o) => o.id === id ? { ...o, delivered: null } : o) });
  const del = (id) => { persist({ ...data, orders: data.orders.filter((o) => o.id !== id) }); showToast("Zmazané"); };
  const setComp = (id, val) => {
    persist({ ...data, orders: data.orders.map((o) => o.id === id ? {
      ...o, compensation: val,
      wait: o.wait && o.wait.endedAt ? { ...o.wait, resolution: val > 0 ? "custom" : "skipped" } : o.wait
    } : o) });
    setKeypad(null);
    showToast(val > 0 ? `Kompenzácia ${eur(val)}` : "Kompenzácia vymazaná");
  };
  const waitStart = (id) => {
    const at = new Date().toISOString();
    persist({ ...data, orders: data.orders.map((o) => o.id === id && !o.delivered && !o.wait && o.service in WAIT_LIMITS ?
      { ...o, wait: { startedAt: at, endedAt: null, resolution: null } } : o) });
  };
  const waitEnd = (id) => {
    const at = new Date().toISOString();
    persist({ ...data, orders: data.orders.map((o) => o.id === id && o.wait && !o.wait.endedAt ?
      { ...o, wait: { ...o.wait, endedAt: at } } : o) });
  };
  const waitResolve = (id, resolution, value) => {
    persist({ ...data, orders: data.orders.map((o) => o.id === id && o.wait && o.wait.endedAt && !o.wait.resolution ?
      { ...o, compensation: resolution === "accepted" ? value : o.compensation, wait: { ...o.wait, resolution } } : o) });
    showToast(resolution === "accepted" ? `Pridané ${eur(value)}` : "Bez kompenzácie");
  };
  const setTip = (date, val) => { const tips = { ...data.tips }; if (val > 0) tips[date] = val; else delete tips[date]; persist({ ...data, tips }); setKeypad(null); showToast(val > 0 ? `Prepitné ${eur(val)}` : "Prepitné vymazané"); };

  const shareOrder = (o) => {
    const s = SERVICES[o.service];
    const total = eur(amt(o));
    const compNote = (o.compensation || 0) > 0 ? ` (v tom komp ${eur(o.compensation)})` : "";
    const dorucena = o.delivered ? `——${hm(o.delivered)} (${durText(durMin(o.received, o.delivered))})` : "—— ešte nie";
    const t = `${s.name} ——${total}${compNote}\nPrijatá ——${hm(o.received)} | Doručená ${dorucena}`;
    shareText(t, showToast);
  };

  /* today numbers */
  const today = todayISO();
  const todayOrders = data.orders.filter((o) => localDate(o.received) === today);
  const todayDelivered = todayOrders.filter((o) => o.delivered).reduce((a, o) => a + amt(o), 0);
  const todayTotal = todayOrders.reduce((a, o) => a + amt(o), 0);
  const undeliveredN = todayOrders.filter((o) => !o.delivered).length;
  const todayTip = data.tips[today] || 0;

  const shareTotal = () => {
    let t;
    if (undeliveredN > 0) t = `Zatiaľ je to ${eur(todayDelivered)}\nTreba doručiť ${undeliveredN}, potom bude ${eur(todayTotal)}`;
    else t = `Zatiaľ je to ${eur(todayDelivered)}\nTreba doručiť 0`;
    if (todayTip > 0) t += `\nPrepitné ${eur(todayTip)} (navyše)`;
    shareText(t, showToast);
  };

  /* available weeks / months for pickers */
  const periods = useMemo(() => {
    const wk = new Set([weekSel]), mo = new Set([monthSel]);
    data.orders.forEach((o) => { wk.add(localDate(mondayOf(new Date(o.received)))); mo.add(localDate(o.received).slice(0, 7)); });
    const wkSum = {}, moSum = {};
    data.orders.forEach((o) => {
      const w = localDate(mondayOf(new Date(o.received))); wkSum[w] = (wkSum[w] || 0) + amt(o);
      const m = localDate(o.received).slice(0, 7); moSum[m] = (moSum[m] || 0) + amt(o);
    });
    const weeks = [...wk].sort((a, b) => (a < b ? 1 : -1)).map((k) => ({ key: k, label: `${weekLabel(k)} ${k.slice(0,4)}`, sub: eur(wkSum[k] || 0) }));
    const months = [...mo].sort((a, b) => (a < b ? 1 : -1)).map((k) => ({ key: k, label: monthLabel(k), sub: eur(moSum[k] || 0) }));
    return { weeks, months };
  }, [data, weekSel, monthSel]);

  /* range filter */
  const rangeOrders = useMemo(() => {
    if (tab === "all") return data.orders;
    if (tab === "day") return data.orders.filter((o) => localDate(o.received) === today);
    if (tab === "week") {
      const from = new Date(weekSel + "T00:00:00"); const to = new Date(from); to.setDate(to.getDate() + 7);
      return data.orders.filter((o) => { const d = new Date(o.received); return d >= from && d < to; });
    }
    // month
    return data.orders.filter((o) => localDate(o.received).slice(0, 7) === monthSel);
  }, [data, tab, weekSel, monthSel, today]);

  const dayGroups = useMemo(() => {
    const g = {};
    rangeOrders.forEach((o) => { const d = localDate(o.received); (g[d] = g[d] || []).push(o); });
    return Object.keys(g).sort((a, b) => (a < b ? 1 : -1)).map((iso) => ({ iso, orders: g[iso] }));
  }, [rangeOrders]);

  /* CSV */
  const exportCSV = () => {
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const head = ["Datum","Sluzba","Suma","Kompenzacia","Prijate","Dorucene","Trvanie_min","Cakanie_prichod","Cakanie_odchod","Cakanie_stav","Dvojita"];
    const orderRows = [...data.orders].sort((a, b) => (a.received > b.received ? 1 : -1)).map((o) =>
      [localDate(o.received), SERVICES[o.service].name, o.amount.toFixed(2), (o.compensation || 0).toFixed(2), o.received, o.delivered || "", o.delivered ? durMin(o.received, o.delivered) : "", o.wait?.startedAt || "", o.wait?.endedAt || "", o.wait?.resolution || "", o.double ? "1" : "0"].map(esc).join(";"));
    const tipRows = Object.keys(data.tips).sort().map((d) =>
      [d, "Prepitne", (data.tips[d] || 0).toFixed(2), "0.00", "", "", "", "", "", "", ""].map(esc).join(";"));
    const csv = [head.map(esc).join(";"), ...orderRows, ...tipRows].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `zarobky-${today}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("CSV stiahnuté ✓");
  };
  const importCSV = (e) => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const text = String(r.result).replace(/^\ufeff/, "");
        const lines = text.split(/\r?\n/).filter((l) => l.trim());
        const splitRow = (l) => l.match(/("([^"]|"")*"|[^;]*)(;|$)/g).map((c) => c.replace(/;$/, "").replace(/^"|"$/g, "").replace(/""/g, '"'));
        const head = splitRow(lines[0]).map((h) => h.toLowerCase());
        const col = (n) => head.indexOf(n);
        const iSvc = col("sluzba"), iAmt = col("suma"), iComp = col("kompenzacia"), iRec = col("prijate"), iDel = col("dorucene");
        const iWaitStart = col("cakanie_prichod"), iWaitEnd = col("cakanie_odchod"), iWaitResolution = col("cakanie_stav"), iDouble = col("dvojita");
        const nameToKey = { bolt: "bolt", wolt: "wolt", bistro: "bistro" };
        const parsed = []; const tipsAdd = {};
        for (let i = 1; i < lines.length; i++) {
          const c = splitRow(lines[i]);
          const svcName = (c[iSvc] || "").toLowerCase();
          const num = parseFloat((c[iAmt] || "").replace(",", "."));
          if (svcName === "prepitne" || svcName === "prepitné") { const d = c[0]; if (d && !isNaN(num)) tipsAdd[d] = (tipsAdd[d] || 0) + num; continue; }
          const svc = nameToKey[svcName];
          const rec = c[iRec];
          if (!svc || isNaN(num) || !rec) continue;
          const comp = iComp >= 0 ? (parseFloat((c[iComp] || "0").replace(",", ".")) || 0) : 0;
          const waitAt = iWaitStart >= 0 ? c[iWaitStart] : "";
          const waitEnd = iWaitEnd >= 0 ? c[iWaitEnd] : "";
          const waitResolution = iWaitResolution >= 0 ? c[iWaitResolution] : "";
          const wait = waitAt && !isNaN(Date.parse(waitAt)) ? {
            startedAt: waitAt, endedAt: waitEnd && !isNaN(Date.parse(waitEnd)) ? waitEnd : null,
            resolution: ["accepted", "skipped", "custom"].includes(waitResolution) ? waitResolution : null
          } : null;
          parsed.push({ id: uid(), service: svc, amount: num, compensation: comp, received: rec, delivered: iDel >= 0 ? c[iDel] || null : null,
            ...(wait ? { wait } : {}), double: iDouble >= 0 && c[iDouble] === "1" });
        }
        if (!parsed.length && !Object.keys(tipsAdd).length) { showToast("Nič sa nenašlo"); return; }
        const key = (o) => `${o.service}|${o.amount}|${o.received}`;
        const have = new Set(data.orders.map(key));
        const fresh = parsed.filter((o) => !have.has(key(o)));
        const tips = { ...data.tips }; Object.keys(tipsAdd).forEach((d) => { if (!tips[d]) tips[d] = tipsAdd[d]; });
        persist({ orders: [...data.orders, ...fresh], tips });
        showToast(`Načítané ${fresh.length} ${objWord(fresh.length)}`);
      } catch (err) { showToast("Chyba pri načítaní"); }
    };
    r.readAsText(f); e.target.value = "";
  };

  const checkUpdate = async () => {
    setUpState("checking");
    try {
      const scriptUrl = new URL("app.js", location.href);
      const res = await fetch(scriptUrl.href + "?_=" + Date.now(), { cache: "no-store" });
      const txt = await res.text();
      const m = txt.match(/APP_VERSION\s*=\s*["']([^"']+)["']/);
      if (!m) { setUpState("error"); return; }
      setUpLatest(m[1]); setUpState(m[1] === APP_VERSION ? "current" : "available");
    } catch (e) { setUpState("error"); }
  };
  const doUpdate = () => { const base = location.pathname.split("?")[0]; location.href = base + "?v=" + Date.now(); };

  const handlers = { onDeliver: deliver, onUndeliver: undeliver, onDelete: del, onShare: shareOrder, onToggleDouble: toggleDouble,
    onWaitStart: waitStart, onWaitEnd: waitEnd, onWaitResolve: waitResolve,
    onWaitCustom: (o) => setKeypad({ kind: "comp", service: o.service, orderId: o.id, initial: (o.compensation || 0) > 0 ? String(o.compensation) : "" }),
    onComp: (o) => setKeypad({ kind: "comp", service: o.service, orderId: o.id, initial: (o.compensation || 0) > 0 ? String(o.compensation) : "" }),
    onTip: (date) => setKeypad({ kind: "tip", date, initial: (data.tips[date] || 0) > 0 ? String(data.tips[date]) : "" }) };
  const TABS = [["day","Dnes"],["week","Týždeň"],["month","Mesiac"],["all","Všetko"]];

  const keypadConfig = () => {
    if (!keypad) return null;
    if (keypad.kind === "order") return { kind: "order", service: keypad.service, title: SERVICES[keypad.service].name, subtitle: "Nový zárobok", initial: "", verb: "Zapísať" };
    if (keypad.kind === "comp") return { kind: "comp", service: keypad.service, icon: "coins", title: "Kompenzácia", subtitle: `${SERVICES[keypad.service].name} objednávka`, initial: keypad.initial, verb: "Uložiť" };
    if (keypad.kind === "tip") return { kind: "tip", icon: "coins", title: "Prepitné", subtitle: dayLabel(keypad.date), initial: keypad.initial, verb: "Uložiť" };
    return null;
  };
  const keypadConfirm = (val, dbl) => {
    if (keypad.kind === "order") addOrder(keypad.service, val, dbl);
    else if (keypad.kind === "comp") setComp(keypad.orderId, val);
    else if (keypad.kind === "tip") setTip(keypad.date, val);
  };
  const keypadClear = () => {
    if (!keypad) return null;
    if (keypad.kind === "tip" && (data.tips[keypad.date] || 0) > 0) return () => setTip(keypad.date, 0);
    if (keypad.kind === "comp") { const o = data.orders.find((x) => x.id === keypad.orderId); if (o && (o.compensation || 0) > 0) return () => setComp(keypad.orderId, 0); }
    return null;
  };

  return (
    <div className="scrollpane" style={{ background: "#FFFFFF" }}>
      {/* subtle colour wash top */}
      <div style={{ position: "fixed", inset: 0, zIndex: -1, background: "radial-gradient(120% 40% at 100% 0%, rgba(254,128,8,0.05), transparent 60%), radial-gradient(90% 30% at 0% 0%, rgba(91,161,203,0.05), transparent 60%), #FFFFFF" }} />

      <div style={{ padding: "max(20px, env(safe-area-inset-top)) 16px 160px", maxWidth: 620, margin: "0 auto" }}>
        {/* header */}
        <div className="rise" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", color: P.faint, fontFamily: SANS, fontWeight: 700 }}>Rozvoz</div>
            <h1 style={{ fontSize: 27, fontWeight: 900, color: P.ink, fontFamily: SANS, letterSpacing: "-0.02em" }}>Zárobky</h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => fileRef.current && fileRef.current.click()} className="press" aria-label="Import CSV" style={{ width: 42, height: 42, borderRadius: 13, background: P.soft, color: P.dim, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="upload" size={19} /></button>
            <button onClick={exportCSV} className="press" aria-label="Stiahnuť CSV" style={{ width: 42, height: 42, borderRadius: 13, background: P.soft, color: P.dim, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="download" size={19} /></button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={importCSV} style={{ display: "none" }} />
          </div>
        </div>

        {/* TODAY hero — always visible */}
        <div className="rise" style={{ "--i": 1, borderRadius: 22, padding: "18px", marginBottom: 16, position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg, #101012 0%, #232327 130%)", color: "#fff", boxShadow: "0 12px 30px rgba(0,0,0,0.28)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.6)", fontFamily: SANS, fontWeight: 700 }}>Dnes máš</div>
              <div style={{ fontSize: 44, fontWeight: 900, fontFamily: MONO, letterSpacing: "-0.03em", marginTop: 2, lineHeight: 1 }}>{eur(todayDelivered)}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={shareTotal} className="press" aria-label="Zdieľať dnešok" style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.12)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="share" size={18} /></button>
            </div>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {undeliveredN > 0 ? (
              <span className="pop" style={{ display: "inline-flex", alignItems: "center", flexWrap: "wrap", gap: "5px 8px", fontFamily: SANS, background: "#E7F2EC", color: "#102A20", padding: "8px 12px", borderRadius: 15, maxWidth: "100%" }}>
                <Icon name="clock" size={15} />
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>bude</span>
                <span style={{ fontSize: 28, lineHeight: 1, fontWeight: 900, letterSpacing: "-0.045em", fontFamily: MONO, fontVariantNumeric: "tabular-nums" }}>{eur(todayTotal)}</span>
                <span style={{ fontSize: 11.5, fontWeight: 700 }}>{undeliveredN} {nedorucWord(undeliveredN)}</span>
              </span>
            ) : todayOrders.length > 0 ? (
              <span className="pop" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, fontFamily: SANS, background: "rgba(80,220,140,0.22)", padding: "7px 12px", borderRadius: 999 }}>
                <Icon name="delivered" size={15} /> všetko doručené
              </span>
            ) : (
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: SANS }}>Zatiaľ žiadne objednávky dnes.</span>
            )}
            {todayOrders.length > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, fontFamily: MONO, color: "rgba(255,255,255,0.75)", padding: "7px 4px" }}>
                <Icon name="hash" size={13} /> {todayOrders.length}
              </span>
            )}
            {todayTip > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, fontFamily: SANS, background: "rgba(255,196,0,0.18)", color: "#FFD766", padding: "7px 12px", borderRadius: 999 }}>
                <Icon name="coins" size={14} /> prepitné {eur(todayTip)} · navyše
              </span>
            )}
          </div>
        </div>

        {/* segment tabs */}
        <div className="rise" style={{ "--i": 2, display: "flex", background: P.soft, borderRadius: 14, padding: 4, marginBottom: 14, gap: 3 }}>
          {TABS.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className="press" style={{ flex: 1, padding: "9px 0", borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: SANS,
              background: tab === k ? "#fff" : "transparent", color: tab === k ? P.ink : P.dim,
              boxShadow: tab === k ? "0 2px 8px rgba(0,0,0,0.1)" : "none" }}>{l}</button>
          ))}
        </div>

        {/* period selector (week / month) */}
        {(tab === "week" || tab === "month") && (
          <button onClick={() => setPicker(tab)} className="press rise" style={{ "--i": 3, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: `1px solid ${P.line}`, borderRadius: 14, padding: "12px 15px", marginBottom: 16, boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 15, fontWeight: 800, color: P.ink, fontFamily: SANS }}>
              <Icon name="calendar" size={17} />
              {tab === "week" ? `${weekLabel(weekSel)} ${weekSel.slice(0,4)}` : monthLabel(monthSel)}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: P.dim, fontFamily: SANS, fontWeight: 600 }}>zmeniť <Icon name="chart" size={14} /></span>
          </button>
        )}

        {/* content */}
        <div key={tab} className="fade">
          {data.orders.length === 0 ? (
            <EmptyHero />
          ) : (
            <React.Fragment>
              {tab !== "day" && <StatsBlock orders={rangeOrders} tips={data.tips} />}
              {dayGroups.length === 0 ? (
                <div style={{ background: P.soft, borderRadius: 18, padding: "48px 20px", textAlign: "center", color: P.faint, fontSize: 14, fontFamily: SANS }}>
                  Žiadne zárobky v tomto období.
                </div>
              ) : dayGroups.map((g, i) => <DaySection key={g.iso} iso={g.iso} orders={g.orders} tips={data.tips} i={i} {...handlers} />)}
            </React.Fragment>
          )}
        </div>

        {/* version */}
        <div style={{ textAlign: "center", marginTop: 8 }}>
          {upState === "available" ? (
            <button onClick={doUpdate} className="press" style={{ background: "#111", color: "#fff", fontSize: 13, fontWeight: 700, padding: "10px 18px", borderRadius: 12, fontFamily: SANS }}>Aktualizovať → v{upLatest}</button>
          ) : (
            <button onClick={checkUpdate} className="press" style={{ background: P.soft, color: P.dim, fontSize: 12.5, padding: "9px 15px", borderRadius: 11, fontFamily: SANS }}>{upState === "checking" ? "Kontrolujem…" : "Skontrolovať aktualizácie"}</button>
          )}
          <div style={{ fontSize: 10.5, color: P.faint, fontFamily: MONO, marginTop: 7 }}>
            {upState === "current" ? "✓ najnovšia · " : upState === "error" ? "offline · " : ""}v{APP_VERSION}
          </div>
        </div>
      </div>

      {/* floating dock */}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, height: 130, zIndex: 20, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 55%, #FFFFFF 100%)" }} />
      <div style={{ position: "fixed", left: 0, right: 0, bottom: "max(16px, env(safe-area-inset-bottom))", zIndex: 21, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "0 16px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 9 }}>
          <div style={{ display: "flex", gap: 10, padding: 8, borderRadius: 26, background: "rgba(255,255,255,0.82)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)", boxShadow: "0 14px 40px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.9)" }}>
            {ORDER.map((k) => {
              const s = SERVICES[k];
              return (
                <button key={k} onClick={() => setKeypad({ kind: "order", service: k })} className="press" aria-label={`Pridať ${s.name}`}
                  style={{ width: 92, height: 62, borderRadius: 19, background: s.grad, color: INK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                    boxShadow: `0 8px 20px ${s.glow}, inset 0 1px 0 rgba(255,255,255,0.45)` }}>
                  <Icon name={svcIcon[k]} size={22} />
                  <span style={{ fontSize: 12, fontWeight: 800, fontFamily: SANS }}>{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* keypad */}
      {keypad && <Keypad config={keypadConfig()} onConfirm={keypadConfirm} onCancel={() => setKeypad(null)} onClear={keypadClear()} />}

      {/* week/month pickers */}
      {picker === "week" && <PickerSheet title="Vyber týždeň" options={periods.weeks} selected={weekSel} onPick={(k) => { setWeekSel(k); setPicker(null); }} onCancel={() => setPicker(null)} />}
      {picker === "month" && <PickerSheet title="Vyber mesiac" options={periods.months} selected={monthSel} onPick={(k) => { setMonthSel(k); setPicker(null); }} onCancel={() => setPicker(null)} />}

      {/* toast */}
      {toast && (
        <div className="toast-in" style={{ position: "fixed", left: "50%", bottom: "max(96px, calc(env(safe-area-inset-bottom) + 96px))", zIndex: 90, background: "rgba(17,17,17,0.94)", color: "#fff", fontSize: 13.5, fontWeight: 600, fontFamily: SANS, padding: "11px 18px", borderRadius: 999, boxShadow: "0 8px 24px rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
