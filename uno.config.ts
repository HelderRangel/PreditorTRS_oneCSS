// uno.config.ts
import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
} from "unocss";

export default defineConfig({
  theme: {
    colors: {
      background: "#F4F6F9",
      white: "#FFFFFF",
      primary: "#1B1143",
      secondary: "#FFD6A5",
      "text-dark": "#2A3042",
      text: "#333333",
      gray: "gray",
      border: "#ccc",
      success: "#52c41a",
      warning: "#faad14",
      alert: "#ff4d4f",
      up: "#4caf50",
      down: "#f44336",
      "table-header": "#f5f5f5",
      "table-row": "#f9f9f9",
      "table-hover": "#e6f7ff",
      "modal-bg": "#f4f4f4",
      trendline: "#89CFF0",
      "background-secondary": "#F0F0F0",
      modalBG: "#f9f9f9", // ou a cor que desejar
      // up: '#22c55e',       // verde
      // down: '#ef4444',     // vermelho
      backgroundSecondary: "#f3f4f6", // por exemplo
      // text: '#1f2937',      // cinza escuro
    },
    breakpoints: {
      xs: "360px",
      sm: "480px", // mobile
      md: "768px", // tablet
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  presets: [presetUno(), presetAttributify(), presetIcons()],
});
