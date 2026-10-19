FROM node:24

WORKDIR /app

COPY package.json .

RUN npm install

COPY src src

COPY tsconfig.json tsconfig.json

COPY .env .env

RUN npm run build

ENV NODE_ENV="production"

ENV BACKEND_PORT=3000

CMD ["node", "--env-file", ".env", "dist/services/backend/app.js"]
