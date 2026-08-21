import { defineConfig } from "vite";
import { sites } from "@openai/sites-vite-plugin";
import vinext from "vinext";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [vinext(), sites(), nitro()],
});
