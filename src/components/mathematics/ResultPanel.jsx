import React, { useEffect, useRef } from "react";
import { convertLatexToMarkup } from "mathlive";
import "mathlive/static.css";

function MathDisplay({ latex }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    if (typeof latex !== "string" || !latex.trim()) {
      ref.current.innerHTML = "";
      return;
    }

    try {
      ref.current.innerHTML = convertLatexToMarkup(latex);
    } catch (error) {
      console.warn("Failed to render:", latex, error);
      ref.current.textContent = latex;
    }
  }, [latex]);

  return <div ref={ref} style={{ fontSize: "1.2rem" }} />;
}

export default function ResultPanel({ result }) {
  const styles = {
    container: { width: "100%", display: "flex", flexDirection: "column", gap: "16px", color: "#ffffff", overflow: "hidden" },
    empty: { background: "#141A22", border: "1px solid #27303b", borderRadius: "16px", padding: "20px", color: "#8b95a5" },
    card: { background: "#141A22", border: "1px solid #27303b", borderRadius: "18px", padding: "16px", width: "100%", boxSizing: "border-box", overflowWrap: "break-word" },
    title: { margin: "0 0 12px", fontSize: "16px", fontWeight: "700" },
    text: { margin: 0, lineHeight: "1.7", whiteSpace: "pre-wrap", wordBreak: "break-word" },
    step: { background: "#0B0F14", border: "1px solid #27303b", borderRadius: "14px", padding: "14px", marginTop: "12px" },
    equation: { marginTop: "12px", background: "#05070a", borderRadius: "12px", padding: "12px", overflowX: "auto", color: "#60a5fa" },
    answer: { background: "#1a2635", border: "1px solid #2563eb", borderRadius: "18px", padding: "16px" },
    help: { marginTop: "8px", fontSize: "12px", color: "#8b95a5", textAlign: "center" },
  };

  if (!result) {
    return (
      <div style={styles.container}>
        <div style={styles.empty}>Your solution will appear here.</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {result.question && (
        <div style={styles.card}>
          <h3 style={styles.title}>Question</h3>
         <div style={styles.equation}>
  <MathDisplay latex={result.question} />
</div>
        </div>
      )}

      {result.criteria && (
        <div style={styles.card}>
          <h3 style={styles.title}>Given / Criteria</h3>
          <p style={styles.text}>{result.criteria}</p>
        </div>
      )}

      {result.variables && (
        <div style={styles.card}>
          <h3 style={styles.title}>Variables</h3>
          {Object.entries(result.variables).map(([key, value]) => (
            <p key={key} style={styles.text}>
              <MathDisplay
latex={`${key}=${value}`}
/>
            </p>
          ))}
        </div>
      )}

      {result.steps?.length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.title}>Solution Steps</h3>
          {result.steps.map((step, index) => (
            <div key={index} style={styles.step}>
              <h4>{step.title || `Step ${index + 1}`}</h4>
              <p style={styles.text}>{step.explanation}</p>
              {step.equation && (
                <div style={styles.equation}>
                  <MathDisplay latex={step.equation} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {result.explanation && (
        <div style={styles.card}>
          <h3 style={styles.title}>Explanation</h3>
          <p style={styles.text}>{result.explanation}</p>
        </div>
      )}

     {result.answer && (

<div style={styles.answer}>

<h3 style={styles.title}>
Final Answer
</h3>

<MathDisplay
latex={result.answer}
/>

<button

style={{

marginTop:16,

padding:"10px 18px",

borderRadius:"10px",

background:"#2563EB",

border:"none",

color:"#fff",

cursor:"pointer"

}}

onClick={()=>

navigator.clipboard.writeText(result.answer)

}

>

Copy Answer

</button>

</div>

)}

      <div
  style={{
    background:"#141A22",
    border:"1px solid #27303b",
    borderRadius:"18px",
    padding:"18px",
    textAlign:"center"
  }}
>

  <h3 style={{marginBottom:10}}>
    Need Human Assistance?
  </h3>

  <p
    style={{
      color:"#9CA3AF",
      lineHeight:1.7
    }}
  >
    Still having difficulty solving
    this question?

    Ask experienced students and
    engineers on INCOG PSD.
  </p>

 <button
  style={{
    marginTop: 18,
    padding: "12px 22px",
    borderRadius: "12px",
    background: "#2563EB",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 600
  }}
  onClick={() => {
    window.open(
      "https://incog-psd.vercel.app",
      "_blank",
      "noopener,noreferrer"
    );
  }}
>
  Take a Screenshot & Broadcast to INCOG PSD
            CLICK HERE
                 ^
</button>

</div>
    </div>
  );
}