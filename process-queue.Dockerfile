FROM node:24

WORKDIR /app

COPY ./package* .

COPY ./dist/services/image-service image-service

COPY ./dist/services/process-queue .

ENV PORT=80

EXPOSE 80

RUN npm install --legacy-peer-deps

CMD [ "node", "./init.js"]
