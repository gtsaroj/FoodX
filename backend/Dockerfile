FROM node:20

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . .

RUN npm run build
