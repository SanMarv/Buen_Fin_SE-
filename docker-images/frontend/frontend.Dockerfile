FROM node:24

WORKDIR /app

COPY package.json ./

COPY ./src/lib ./src/lib

COPY ./src/services/frontend ./src/services/frontend

RUN npm i lib -w frontend

WORKDIR /app/src/services/frontend

RUN npm install

RUN npm run build

ENV PORT=80

ENV NODE_ENV=production

EXPOSE 80

CMD ["node", "--env-file",".env",".output/server/index.mjs"]
