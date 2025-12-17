import "antd/dist/reset.css";
import "antd/es/theme/interface";
import "./index.css";

import { ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TextEditor from "./components/text-editor.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider>
      <TextEditor />
    </ConfigProvider>
  </StrictMode>,
);

