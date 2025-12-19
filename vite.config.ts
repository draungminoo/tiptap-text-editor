import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync, writeFileSync } from "fs";

const BASE = "text-editor";
const BASE_URL = `/app/${BASE}`;

// load package.json and extract homepage
const packageJson = readFileSync("package.json", "utf8");

// update the package.json with the base url
writeFileSync(
  "package.json",
  JSON.stringify({ ...JSON.parse(packageJson), homepage: BASE_URL }, null, 2),
);

// write the base url to the base-url.ts file
writeFileSync(
  "src/config.ts",
  `export const BASE_URL = "${BASE_URL}";
`,
);

// https://vite.dev/config/
export default defineConfig({
  base: BASE_URL,
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1024 * 5, // in kb
    rollupOptions: {
      output: {
        manualChunks: {
          // vendor chunk for React stuff
          react: ["react", "react-dom"],

          // separate chunk for antd
          antd: ["antd"],

          // if you use large icons:
          antdIcons: ['@ant-design/icons'],
        },
      },
    },
  },
});

