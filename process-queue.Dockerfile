FROM node:24

WORKDIR /app

COPY . .

RUN npm run build

RUN npm install

ENV PORT=80

EXPOSE 80

CMD [ "node", "--env-file",".env","dist/services/process-queue/init.js"]
