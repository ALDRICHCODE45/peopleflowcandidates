import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      // Límite de tamaño del cuerpo para Server Actions (por defecto es 1MB)
      // Usar formato string para mejor compatibilidad en producción
      bodySizeLimit: "10mb", // 10MB - debe ser string para funcionar en producción
    },
    // Límite de tamaño del cuerpo para el proxy/middleware
    // Esto es crítico para que las rutas API puedan recibir archivos grandes
    proxyClientMaxBodySize: "10mb", // 10MB - permite archivos grandes en rutas API
  },
};

export default nextConfig;
