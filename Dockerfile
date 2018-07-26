FROM node:alpine

WORKDIR /usr/src/facebook-exchange

COPY package*.json ./
RUN npm install
COPY . .

CMD [ "npm", "start" ]