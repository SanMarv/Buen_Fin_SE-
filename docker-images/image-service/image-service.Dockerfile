FROM node:24

WORKDIR /app

COPY package.json ./

RUN npm install

COPY src src

COPY tsconfig.json .

COPY .env .env

RUN npm run build

ENV PORT=80

ENV NODE_ENV=production

EXPOSE 80

CMD ["node", "--env-file",".env","dist/services/process-queue/index.js"]
