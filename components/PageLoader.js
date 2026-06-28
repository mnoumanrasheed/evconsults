"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("init"); // init | ready

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1.8;
        if (next >= 100) {
          clearInterval(interval);
          setPhase("ready");
          setTimeout(() => setLoading(false), 700);
          return 100;
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "linear-gradient(135deg, #040D1A 0%, #0B1F33 60%, #040D1A 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Animated background grid */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.4,
            backgroundImage: "linear-gradient(rgba(0,174,239,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,174,239,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

          {/* Scan line */}
          <motion.div
            animate={{ y: ["-10vh", "110vh"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute", left: 0, right: 0, height: "3px", top: 0,
              background: "linear-gradient(90deg, transparent 0%, rgba(57,211,83,0.0) 20%, rgba(57,211,83,0.7) 50%, rgba(57,211,83,0.0) 80%, transparent 100%)",
              filter: "blur(1px)",
            }}
          />

          {/* Ambient glow orbs */}
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }}
            style={{ position: "absolute", top: "10%", left: "5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,174,239,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            style={{ position: "absolute", bottom: "10%", right: "5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(57,211,83,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Center content */}
          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem" }}>

            {/* Spinning ring logo */}
            <div style={{ position: "relative", width: "120px", height: "120px" }}>
              {/* Outer ring */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#39D353", borderRightColor: "#00AEEF", filter: "drop-shadow(0 0 8px rgba(57,211,83,0.5))" }} />
              {/* Middle ring */}
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", inset: "12px", borderRadius: "50%", border: "1.5px solid transparent", borderTopColor: "rgba(0,174,239,0.6)", borderLeftColor: "rgba(57,211,83,0.4)" }} />
              {/* Inner glow */}
              <div style={{
                position: "absolute", inset: "25px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(57,211,83,0.25) 0%, rgba(0,174,239,0.1) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(57,211,83,0.3)",
              }}>
                <motion.svg animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }} width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#39D353" stroke="#39D353" strokeWidth="0.5" />
                </motion.svg>
              </div>
              {/* Orbiting dot */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", inset: 0, borderRadius: "50%" }}>
                <div style={{ position: "absolute", top: "2px", left: "50%", transform: "translateX(-50%)", width: "8px", height: "8px", borderRadius: "50%", background: "#39D353", boxShadow: "0 0 10px #39D353" }} />
              </motion.div>
            </div>

            {/* Brand text */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
              style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.8rem", fontWeight: "900", color: "white", letterSpacing: "-0.02em", lineHeight: 1 }}>
                EV<span style={{ color: "#39D353" }}>Consults</span>
              </div>
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.6, duration: 0.5 }}
                style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(57,211,83,0.5), transparent)", margin: "0.6rem 0" }} />
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", letterSpacing: "4px", textTransform: "uppercase" }}>
                Pakistan's EV Advisory Platform
              </div>
            </motion.div>

            {/* Progress area */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ width: "260px", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div style={{ height: "2px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                <motion.div style={{ height: "100%", background: "linear-gradient(90deg, #39D353, #00AEEF)", borderRadius: "2px", width: `${progress}%`, transition: "width 0.03s linear" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", textTransform: "uppercase" }}>
                  {phase === "ready" ? "✓ System Ready" : "Initializing..."}
                </span>
                <span style={{ fontSize: "0.68rem", color: "#39D353", fontWeight: "700", fontFamily: "monospace" }}>
                  {Math.floor(progress)}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* Corner decorations */}
          {[["top-0 left-0", "right"], ["top-0 right-0", "left"], ["bottom-0 left-0", "right"], ["bottom-0 right-0", "left"]].map(([pos, _], i) => (
            <div key={i} style={{
              position: "absolute",
              ...(i < 2 ? { top: "20px" } : { bottom: "20px" }),
              ...(i % 2 === 0 ? { left: "20px" } : { right: "20px" }),
              width: "30px", height: "30px",
              borderTop: i < 2 ? "1px solid rgba(57,211,83,0.3)" : "none",
              borderBottom: i >= 2 ? "1px solid rgba(57,211,83,0.3)" : "none",
              borderLeft: i % 2 === 0 ? "1px solid rgba(57,211,83,0.3)" : "none",
              borderRight: i % 2 === 1 ? "1px solid rgba(57,211,83,0.3)" : "none",
            }} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
