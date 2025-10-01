import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/client/App";
import "@/client/emotes.css";
import "@/client/index.css";

const elem = document.getElementById("root")!;

if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(<App />);
} else {
  // The hot module reloading API is not available in production.
  createRoot(elem).render(<App />);
}
