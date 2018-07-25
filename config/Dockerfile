FROM node:alpine

ADD imagini /opt/app
WORKDIR /opt/app

ADD imagini/imagini.js /opt/app/imagini.js
ADD imagini/settings.json /opt/app/settings.json
ADD package.json /opt/app/package.json

RUN npm i

CMD [ "node", "/opt/app/imagini" ]