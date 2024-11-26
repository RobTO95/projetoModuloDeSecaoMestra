import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	server: {
		host: "0.0.0.0", // Permite acesso pela rede local
		port: 5173, // Porta padrão do Vite
	},
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
