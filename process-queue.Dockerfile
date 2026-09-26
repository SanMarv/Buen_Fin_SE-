FROM node:24

WORKDIR /app

COPY dist .

COPY package.json .

RUN npm install

ENV PORT=80

EXPOSE 80

CMD [ "node", "services/process-queue/init.js"]
