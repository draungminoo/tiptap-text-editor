import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TextEditorComponent from "./components/text-editor-component.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TextEditorComponent />
  </StrictMode>,
);

