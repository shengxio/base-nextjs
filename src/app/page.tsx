"use client";

import { useRef, useState } from "react";

type AguiEvent = { type: string; [k: string]: any };

export default function Home() {
  const [text, setText] = useState("");
  const [stream, setStream] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'info' | 'success' } | null>(null);
  const esRef = useRef<EventSource | null>(null);

  const showNotification = (message: string, type: 'error' | 'info' | 'success' = 'error') => {
    setNotification({ message, type });
    // Auto-hide after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  const run = () => {
    if (esRef.current) esRef.current.close();
    setStream("");

    const url = `http://localhost:8000/agui/run?q=${encodeURIComponent(text)}`;
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
          showNotification("Query completed successfully!", "success");
          break;
        case "RUN_ERROR":
          es.close();
          setStream(`[error] ${ev.message}`);
          showNotification(`Error: ${ev.message}`, "error");
          break;
      }
    };

    es.onerror = () => {
      es.close();
      showNotification("Connection error occurred. Please try again.", "error");
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && text.trim()) {
      run();
    }
  };

  return (
    <div style={{ 
      maxWidth: 720, 
      margin: "2rem auto", 
      fontFamily: "system-ui",
      padding: "0 1rem",
      minHeight: "100vh",
      position: "relative"
    }}>
      <h1 style={{ 
        color: "#333", 
        textAlign: "center", 
        marginBottom: "2rem",
        fontSize: "2rem",
        fontWeight: "bold"
      }}>
        AG-UI × Pydantic-AI
      </h1>
      <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask something…"
          style={{ 
            flex: 1, 
            padding: 12, 
            borderRadius: 12, 
            border: "1px solid #ddd",
            fontSize: "1rem",
            color: "#333",
            backgroundColor: "#fff"
          }}
        />
        <button 
          onClick={run} 
          disabled={!text.trim()}
          style={{ 
            padding: "12px 16px", 
            borderRadius: 12,
            backgroundColor: text.trim() ? "#0070f3" : "#ccc",
            color: "#fff",
            border: "none",
            cursor: text.trim() ? "pointer" : "not-allowed",
            fontSize: "1rem",
            fontWeight: "500"
          }}
          onMouseEnter={(e) => {
            if (text.trim()) {
              e.currentTarget.style.backgroundColor = "#0051cc";
            }
          }}
          onMouseLeave={(e) => {
            if (text.trim()) {
              e.currentTarget.style.backgroundColor = text.trim() ? "#0070f3" : "#ccc";
            }
          }}
        >
          Run
        </button>
      </div>
      <pre style={{ 
        whiteSpace: "pre-wrap", 
        marginTop: 16, 
        padding: 16, 
        background: "#f8f9fa", 
        borderRadius: 12,
        border: "1px solid #e9ecef",
        color: "#333",
        fontSize: "0.9rem",
        lineHeight: "1.5",
        minHeight: "100px",
        overflowWrap: "break-word"
      }}>
        {stream || "• • •"}
      </pre>

      {/* Notification System */}
      {notification && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: notification.type === 'error' ? "#dc3545" : 
                         notification.type === 'success' ? "#28a745" : "#17a2b8",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
          maxWidth: "90vw",
          textAlign: "center",
          fontSize: "0.9rem",
          fontWeight: "500"
        }}>
          {notification.message}
          <button
            onClick={() => setNotification(null)}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              marginLeft: "12px",
              cursor: "pointer",
              fontSize: "1.2rem",
              fontWeight: "bold"
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
} 