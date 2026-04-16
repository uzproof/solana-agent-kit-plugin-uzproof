import { defineConfig } from "vitest/config";

/* Minimal vitest setup — picks up *.test.ts under src/. No DOM, no
   coverage gate yet; this file ships just so the xPayment-passthrough
   guard can run on every commit. Expand when more tools gain paid
   behavior worth testing. */
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
    globals: false,
  },
});
