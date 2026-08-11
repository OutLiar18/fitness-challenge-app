import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "firebase-vendor",
              test: /node_modules[\\/](?:@firebase|firebase)[\\/]/,
              priority: 30,
              // Keep the existing Firebase grouping, but let Rolldown partition
              // the oversized group instead of forcing every SDK module into
              // one >500 KiB chunk.
              maxSize: 360 * 1024,
            },
            {
              name: "react-vendor",
              test: /node_modules[\\/](?:react|react-dom|react-router|react-router-dom)[\\/]/,
              priority: 20,
            },
            {
              name: "vendor",
              test: /node_modules[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
});
