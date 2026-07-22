import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
  // El índice de @acta-team/credentials exporta ActaConfig, un provider React
  // que llama a createContext al evaluarse. Empaquetado bajo la condición
  // react-server ese API no existe y el build falla al recolectar rutas.
  // Marcarlo externo lo deja resolverse con Node en runtime, donde React está
  // completo. stellar-sdk va igual: trae binarios y no gana nada al empaquetarse.
  serverExternalPackages: ["@acta-team/credentials", "@stellar/stellar-sdk"],
};

export default nextConfig;
