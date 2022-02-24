FROM node:alpine
WORKDIR /usr/app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
CMD ["node","api.js"]