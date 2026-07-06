import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {

    const env = loadEnv(mode, path.resolve(__dirname));
    const apiTarget = env.VITE_API_URL || `http://localhost:${env.VITE_PORT || 5000}`;

    return {
        plugins: [react()],
        server: {
            proxy: {
                "/api": {
                    target: apiTarget,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },
    }

});