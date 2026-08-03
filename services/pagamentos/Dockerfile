FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

FROM node:20-alpine AS final
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
COPY index.js ./

RUN addgroup -g 1001 -S appgroup && adduser -u 1001 -S appuser -G appgroup
USER 1001

EXPOSE 3002
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3002/health || exit 1

CMD ["node", "index.js"]
