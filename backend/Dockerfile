FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY . .

RUN mkdir -p uploads/images uploads/documents uploads/media

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]
