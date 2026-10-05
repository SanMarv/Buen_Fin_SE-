FROM node:24

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

ENV PORT=80

EXPOSE 80

CMD [ "NODE_ENV=production","node", "--env-file",".env","dist/services/process-queue/init.js"]
