import { useRef, useState } from "react";

type AguiEvent = { type: string; [k: string]: any };

export default function App() {
  const [text, setText] = useState("");
  const [stream, setStream] = useState("");
  const esRef = useRef<EventSource | null>(null);

  const run = () => {
    if (esRef.current) esRef.current.close();
    setStream("");

    const url = `/agui/run?q=${encodeURIComponent(text)}`;
    const es = new EventSource(url, { withCredentials: false });
    esRef.current = es;

    es.onmessage = (evt) => {
      const ev: AguiEvent = JSON.parse(evt.data);
      switch (ev.type) {
        case "RUN_STARTED":
          setStream("");
          break;
        case "TEXT_MESSAGE_CONTENT":
          setStream((s) => s + ev.delta);
          break;
        case "TEXT_MESSAGE_END":
          // no-op
          break;
        case "RUN_FINISHED":
          es.close();
          break;
        case "RUN_ERROR":
          es.close();
          setStream(`[error] ${ev.message}`);
          break;
      }
    };

    es.onerror = () => {
      es.close();
    };
  };

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", fontFamily: "system-ui" }}>
      <h1>AG-UI × Pydantic-AI</h1>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask something…"
          style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
        />
        <button onClick={run} style={{ padding: "12px 16px", borderRadius: 12 }}>
          Run
        </button>
      </div>
      <pre style={{ whiteSpace: "pre-wrap", marginTop: 16, padding: 12, background: "#fafafa", borderRadius: 12 }}>
        {stream || "• • •"}
      </pre>
    </div>
  );
}
