import tailwind from "bun-plugin-tailwind";

await Bun.build({
  plugins: [tailwind],
  outdir: "dist",
  entrypoints: ["src/index.ts"],
  target: "bun",
  minify: true,
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    BUN_ENV: JSON.stringify("production"),
  },
});
