# ---- Estágio de build ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# ---- Estágio final (imagem enxuta) ----
FROM node:20-alpine AS final
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
COPY index.js ./

# Usuário não-root (boas práticas de segurança)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3003
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3003/health || exit 1

CMD ["node", "index.js"]
