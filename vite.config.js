import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	root: "src", // Define a pasta 'src' como raiz
	build: {
		outDir: "../dist", // A pasta de saída será 'dist' na raiz
	},
	resolve: {
		alias: {
			"@assets": path.resolve(__dirname, "./assets"),
			"@controllers": path.resolve(__dirname, "./controllers"),
			"@models": path.resolve(__dirname, "./models"),
			"@views": path.resolve(__dirname, "./views"),
			"@utils": path.resolve(__dirname, "./utils"),
			"@services": path.resolve(__dirname, "./services"),
		},
	},
});
